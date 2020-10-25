# Add-ons for graphene-relay for subscriptions

import re

from graphene.utils.get_unbound_function import get_unbound_function
from graphene.utils.props import props
from graphene.types.field import Field
from graphene.types.objecttype import ObjectType, ObjectTypeOptions
from graphene.types.utils import yank_fields_from_attrs
from graphene.types.interface import Interface

from graphene.types import Field, InputObjectType, String


class SubscriptionOptions(ObjectTypeOptions):
    arguments = None  # type: Dict[str, Argument]
    output = None  # type: Type[ObjectType]
    resolver = None  # type: Callable
    interfaces = ()  # type: Iterable[Type[Interface]]


class Subscription(ObjectType):

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        interfaces=(),
        resolver=None,
        output=None,
        arguments=None,
        _meta=None,
        **options,
    ):
        if not _meta:
            _meta = SubscriptionOptions(cls)

        output = output or getattr(cls, "Output", None)
        fields = {}

        for interface in interfaces:
            assert issubclass(
                interface, Interface
            ), f'All interfaces of {cls.__name__} must be a subclass of Interface. Received "{interface}".'
            fields.update(interface._meta.fields)

        if not output:
            # If output is defined, we don't need to get the fields
            fields = {}
            for base in reversed(cls.__mro__):
                fields.update(yank_fields_from_attrs(base.__dict__, _as=Field))
            output = cls

        if not arguments:
            input_class = getattr(cls, "Arguments", None)
            if not input_class:
                input_class = getattr(cls, "Input", None)

            if input_class:
                arguments = props(input_class)
            else:
                arguments = {}

        if not resolver:
            subscribe = getattr(cls, "subscribe", None)
            assert subscribe, "All subscriptions must define a subscribe method in it"
            resolver = get_unbound_function(subscribe)

        if _meta.fields:
            _meta.fields.update(fields)
        else:
            _meta.fields = fields

        _meta.interfaces = interfaces
        _meta.output = output
        _meta.resolver = resolver
        _meta.arguments = arguments

        super(Subscription, cls).__init_subclass_with_meta__(_meta=_meta, **options)

    @classmethod
    def Field(
        cls, name=None, description=None, deprecation_reason=None, required=False
    ):
        """ Mount instance of subscription Field. """
        return Field(
            cls._meta.output,
            args=cls._meta.arguments,
            resolver=cls._meta.resolver,
            name=name,
            description=description or cls._meta.description,
            deprecation_reason=deprecation_reason,
            required=required,
        )


class ClientIDSubscription(Subscription):
    class Meta:
        abstract = True

    @classmethod
    def __init_subclass_with_meta__(
        cls, output=None, input_fields=None, arguments=None, name=None, **options
    ):
        input_class = getattr(cls, "Input", None)
        base_name = re.sub("Payload$", "", name or cls.__name__)

        assert not output, "Can't specify any output"
        assert not arguments, "Can't specify any arguments"

        bases = (InputObjectType,)
        if input_class:
            bases += (input_class,)

        if not input_fields:
            input_fields = {}

        cls.Input = type(
            f"{base_name}Input",
            bases,
            dict(input_fields, client_subscription_id=String(name="clientSubscriptionId")),
        )

        arguments = dict(
            input=cls.Input(required=True)
            # 'client_subscription_id': String(name='clientSubscriptionId')
        )
        subscribe_and_get_payload = getattr(cls, "subscribe_and_get_payload", None)
        if cls.subscribe and cls.subscribe.__func__ == ClientIDSubscription.subscribe.__func__:
            assert subscribe_and_get_payload, (
                f"{name or cls.__name__}.subscribe_and_get_payload method is required"
                " in a ClientIDSubscription."
            )

        if not name:
            name = f"{base_name}Payload"

        super(ClientIDSubscription, cls).__init_subclass_with_meta__(
            output=None, arguments=arguments, name=name, **options
        )
        cls._meta.fields["client_subscription_id"] = Field(String, name="clientSubscriptionId")

    @classmethod
    def subscribe(cls, root, info, input):
        def on_resolve(payload):
            def set_client_subscription_id(item):
                try:
                    item.client_subscription_id = input.get("client_subscription_id")
                except Exception:
                    raise Exception(
                        f"Cannot set client_subscription_id in the payload object {repr(payload)}"
                    )
                return item
            return payload.map(set_client_subscription_id)

        result = cls.subscribe_and_get_payload(root, info, **input)
        return on_resolve(result)
