# Code taken from https://github.com/hballard/graphql-ws/tree/pubsub under MIT license.
# Redis version is also available from the above branch.

from rx.subjects import Subject
from rx import config


class SubjectObserversWrapper(object):
    def __init__(self, pubsub, channel):
        self.pubsub = pubsub
        self.channel = channel
        self.observers = []

        self.lock = config["concurrency"].RLock()

    def __getitem__(self, key):
        return self.observers[key]

    def __getattr__(self, attr):
        return getattr(self.observers, attr)

    def remove(self, observer):
        with self.lock:
            self.observers.remove(observer)
            if not self.observers:
                self.pubsub.unsubscribe(self.channel)


class GeventRxPubsub(object):

    def __init__(self):
        self.subscriptions = {}

    def publish(self, channel, payload):
        if channel in self.subscriptions:
            self.subscriptions[channel].on_next(payload)

    def subscribe_to_channel(self, channel):
        if channel in self.subscriptions:
            return self.subscriptions[channel]
        else:
            subject = Subject()
            # monkeypatch Subject to unsubscribe pubsub on observable
            # subscription.dispose()
            subject.observers = SubjectObserversWrapper(self, channel)
            self.subscriptions[channel] = subject
            return subject

    def unsubscribe(self, channel):
        if channel in self.subscriptions:
            del self.subscriptions[channel]
