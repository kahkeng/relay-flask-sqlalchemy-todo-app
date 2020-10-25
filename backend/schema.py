#
# Copyright (c) 2017 Sean Bolton.
# Copyright (c) 2020 Kah Keng Tay.
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import graphene
from sqlalchemy import and_, func
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, User as UserModel, Todo as TodoModel
import graphql_relay

from pubsub import GeventRxPubsub
import relay_helper

pubsub = GeventRxPubsub()

# Uncomment these to show sql queries
#import logging
#logging.basicConfig()
#logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

class Todo(SQLAlchemyObjectType):
    class Meta:
        model = TodoModel
        interfaces = (relay.Node, )
        use_connection = False


class TodoConnection(relay.Connection):
    class Meta:
        node = Todo


class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel
        interfaces = (relay.Node, )

    todos = relay.ConnectionField(TodoConnection, status=graphene.String('any'))
    total_count = graphene.Int()
    completed_count = graphene.Int()

    @staticmethod
    def resolve_todos(root, info, **kwargs):
        qs = root.todos
        status = kwargs.get('status', None)
        if status and status != 'any':
            qs = qs.filter(TodoModel.complete == (status == 'completed'))
        return qs.all()

    @staticmethod
    def resolve_total_count(root, info):
        return root.todos.count()

    @staticmethod
    def resolve_completed_count(root, info):
        return root.todos.filter(TodoModel.complete == True).count()


def get_viewer():
    return UserModel.query.filter(UserModel.name == 'me').first()


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    viewer = graphene.Field(User)

    @staticmethod
    def resolve_viewer(root, info):
        return get_viewer()

    user = relay.Node.Field(User)
    todo = relay.Node.Field(Todo)
    all_users = SQLAlchemyConnectionField(User.connection)
    all_todos = SQLAlchemyConnectionField(TodoConnection)



class AddTodo(relay.ClientIDMutation):
    # mutation AddTodoMutation($input: AddTodoInput!) {
    #   addTodo(input: $input) {
    #     todoEdge { __typename cursor node { complete id text } }
    #     viewer { id totalCount }
    #   }
    # }
    # example variables: input: { text: "New Item!", clientMutationId: 0 }

    todo_edge = graphene.Field(TodoConnection.Edge)
    viewer = graphene.Field(User)

    class Input:
        text = graphene.String(required=True)
        # client_mutation_id is supplied automatically

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        viewer = get_viewer()
        text = input.get('text')
        todo = TodoModel(user=viewer, text=text, complete=False)
        db_session.add(todo)
        db_session.commit()
        edge = TodoConnection.Edge(
            node=todo,
            cursor=graphql_relay.connection.arrayconnection.cursor_for_object_in_connection(viewer.todos.all(), todo),
        )
        mutation = AddTodo(todo_edge=edge, viewer=viewer)
        pubsub.publish('ADD_TODO', mutation)
        return mutation


class ChangeTodoStatus(relay.ClientIDMutation):
    # mutation ChangeTodoStatusMutation($input: ChangeTodoStatusInput!) {
    #   changeTodoStatus(input: $input) {
    #     todo { id complete }
    #     viewer { id completedCount }
    #   }
    # }
    # example variables: input: { complete: true, id: "VG9kbzoy"}
    todo = graphene.Field(Todo)
    viewer = graphene.Field(User)

    class Input:
        complete = graphene.Boolean(required=True)
        id = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        viewer = get_viewer()
        id = input.get('id')
        complete = input.get('complete')
        try:
            typ, pk = graphql_relay.from_global_id(id) # may raise if improperly encoded
            assert typ == 'Todo', 'changeTodoStatus called with type {}'.format(typ)
            todo = TodoModel.query.get(pk)
        except:
            raise Exception("received invalid Todo id '{}'".format(id))
        todo.complete = complete
        db_session.commit()
        mutation = ChangeTodoStatus(todo=todo, viewer=viewer)
        pubsub.publish('CHANGE_TODO_STATUS', (id, mutation))
        pubsub.publish('INSERT_TODO', mutation)  # we might need to insert into some views
        return mutation


class MarkAllTodos(relay.ClientIDMutation):
    # mutation MarkAllTodosMutation($input: MarkAllTodosInput!, $status: String!) {
    #   markAllTodos(input: $input) {
    #     changedTodos { id complete }
    #     viewer { id completedCount }
    #   }
    # }
    # example variables: input: { complete: true }
    changed_todos = graphene.List(Todo)
    viewer = graphene.Field(User)

    class Input:
        complete = graphene.Boolean(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        viewer = get_viewer()
        complete = input.get('complete')
        # save the list of items that will be changed
        changed = [todo for todo in viewer.todos.filter(TodoModel.complete != complete).all()]
        # bulk change them
        viewer.todos.filter(TodoModel.complete != complete).update({TodoModel.complete: complete})
        db_session.commit()
        # emit updates to subscriptions
        for todo in changed:
            id = graphql_relay.to_global_id('Todo', todo.id)
            mutation = ChangeTodoStatus(todo=todo, viewer=viewer)
            pubsub.publish('CHANGE_TODO_STATUS', (id, mutation))
            pubsub.publish('INSERT_TODO', mutation)  # we might need to insert into some views
        return MarkAllTodos(changed_todos=changed, viewer=viewer)


class RemoveCompletedTodos(relay.ClientIDMutation):
    # mutation RemoveCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
    #   removeCompletedTodos(input: $input) {
    #     deletedTodoIds
    #     viewer { completedCount totalCount id }
    #   }
    # }
    # example variables: input: { }
    deleted_todo_ids = graphene.List(graphene.String)
    viewer = graphene.Field(User)

    class Input:
        pass

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        viewer = get_viewer()
        # save the list of items that will be deleted
        deleted = [graphql_relay.to_global_id('Todo', todo.id)
                   for todo in viewer.todos.filter(TodoModel.complete == True).all()]
        # bulk delete them
        viewer.todos.filter(TodoModel.complete == True).delete()
        db_session.commit()
        # emit updates to subscriptions
        for id in deleted:
            mutation = RemoveTodo(deleted_todo_id=id, viewer=viewer)
            pubsub.publish('REMOVE_TODO', mutation)
        return RemoveCompletedTodos(deleted_todo_ids=deleted, viewer=viewer)


class RemoveTodo(relay.ClientIDMutation):
    # mutation RemoveTodoMutation($input: RemoveTodoInput!) {
    #   removeTodo(input: $input) {
    #     deletedTodoId
    #     viewer { completedCount totalCount id }
    #   }
    # }
    # example variables: input: { id: "VG9bzoy" }
    deleted_todo_id = graphene.ID()
    viewer = graphene.Field(User)

    class Input:
        id = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        viewer = get_viewer()
        id = input.get('id')
        try:
            typ, pk = graphql_relay.from_global_id(id)
            assert typ == 'Todo', 'changeTodoStatus called with type {}'.format(typ)
        except:
            raise Exception("received invalid Todo id '{}'".format(id))
        count = viewer.todos.filter(TodoModel.id == pk).delete()
        db_session.commit()
        if count == 0:
            id = None
        mutation = RemoveTodo(deleted_todo_id=id, viewer=viewer)
        pubsub.publish('REMOVE_TODO', mutation)
        return mutation


class RenameTodo(relay.ClientIDMutation):
    # mutation RenameTodoMutation($input: RenameTodoInput!) {
    #   renameTodo(input: $input) {
    #     todo {  id text }
    #   }
    # }
    # example variables: input: { text: "New Text", id: "VG9kbzoyOQ=="}
    todo = graphene.Field(Todo)

    class Input:
        id = graphene.ID(required=True)
        text = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        id = input.get('id')
        text = input.get('text')
        try:
            typ, pk = graphql_relay.from_global_id(id)
            assert typ == 'Todo', 'renameTodo called with type {}'.format(typ)
            todo = TodoModel.query.get(pk)
        except:
            raise Exception("received invalid Todo id '{}'".format(id))
        todo.text = text
        db_session.commit()
        mutation = RenameTodo(todo=todo)
        pubsub.publish('RENAME_TODO', mutation)
        return mutation


class Mutation(graphene.ObjectType):
    add_todo = AddTodo.Field()
    change_todo_status = ChangeTodoStatus.Field()
    mark_all_todos = MarkAllTodos.Field()
    remove_completed_todos = RemoveCompletedTodos.Field()
    remove_todo = RemoveTodo.Field()
    rename_todo = RenameTodo.Field()


class AddTodoSubscription(relay_helper.ClientIDSubscription):
    todo_edge = graphene.Field(TodoConnection.Edge)
    viewer = graphene.Field(User)

    class Input:
        status = graphene.String(required=True)

    @classmethod
    def filter_by_status(cls, mutation, status):
        if status == 'any':
            return True
        elif status == 'active':
            return not mutation.todo_edge.node.complete
        elif status == 'completed':
            return mutation.todo_edge.node.complete
        else:
            assert 0, 'invalid status %s' % status

    @classmethod
    def get_payload_from_mutation(cls, mutation, status):
        include_edge = cls.filter_by_status(mutation, status)
        if include_edge:
            return AddTodoSubscription(todo_edge=mutation.todo_edge, viewer=mutation.viewer)
        else:
            return AddTodoSubscription(viewer=mutation.viewer)

    @classmethod
    def subscribe_and_get_payload(cls, root, info, **input):
        status = input.get('status')
        return pubsub.subscribe_to_channel('ADD_TODO')\
            .map(lambda mutation: cls.get_payload_from_mutation(mutation, status))


class ChangeTodoStatusSubscription(relay_helper.ClientIDSubscription):
    todo = graphene.Field(Todo)
    viewer = graphene.Field(User)

    class Input:
        id = graphene.ID(required=True)

    @classmethod
    def filter_by_id(cls, trigger_id, subscription_id):
        # We only want to publish to subscription with the correct id
        return trigger_id == subscription_id

    @classmethod
    def get_payload_from_mutation(cls, mutation):
        return ChangeTodoStatusSubscription(todo=mutation.todo, viewer=mutation.viewer)

    @classmethod
    def subscribe_and_get_payload(cls, root, info, **input):
        return pubsub.subscribe_to_channel('CHANGE_TODO_STATUS')\
            .filter(lambda id_and_mutation: cls.filter_by_id(id_and_mutation[0], input.get('id')))\
            .map(lambda id_and_mutation: cls.get_payload_from_mutation(id_and_mutation[1]))


class InsertTodoSubscription(relay_helper.ClientIDSubscription):
    todo_edge = graphene.Field(TodoConnection.Edge)
    viewer = graphene.Field(User)

    class Input:
        status = graphene.String(required=True)

    @classmethod
    def filter_by_status(cls, mutation, status):
        # We only want to publish to subscription with the correct status
        if status == 'active':
            return not mutation.todo.complete
        elif status == 'completed':
            return mutation.todo.complete
        else:
            return False

    @classmethod
    def get_payload_from_mutation(cls, mutation, status):
        todo = mutation.todo
        viewer = mutation.viewer
        if status == 'active':
            cursor = graphql_relay.connection.arrayconnection.cursor_for_object_in_connection(viewer.todos.filter(TodoModel.complete == False).all(), todo)
        elif status == 'completed':
            cursor = graphql_relay.connection.arrayconnection.cursor_for_object_in_connection(viewer.todos.filter(TodoModel.complete == True).all(), todo)
        else:
            assert 0, 'invalid status %s' % status
        edge = TodoConnection.Edge(
            node=todo,
            cursor=cursor,
        )
        return InsertTodoSubscription(todo_edge=edge, viewer=viewer)

    @classmethod
    def subscribe_and_get_payload(cls, root, info, **input):
        status = input.get('status')
        return pubsub.subscribe_to_channel('INSERT_TODO')\
            .filter(lambda mutation: cls.filter_by_status(mutation, status))\
            .map(lambda mutation: cls.get_payload_from_mutation(mutation, status))


class RemoveTodoSubscription(relay_helper.ClientIDSubscription):
    deleted_todo_id = graphene.ID()
    viewer = graphene.Field(User)

    @classmethod
    def subscribe_and_get_payload(cls, root, info, **input):
        return pubsub.subscribe_to_channel('REMOVE_TODO')\
            .map(lambda mutation: RemoveTodoSubscription(deleted_todo_id=mutation.deleted_todo_id, viewer=mutation.viewer))


class RenameTodoSubscription(relay_helper.ClientIDSubscription):
    todo = graphene.Field(Todo)

    @classmethod
    def subscribe_and_get_payload(cls, root, info, **input):
        return pubsub.subscribe_to_channel('RENAME_TODO')\
            .map(lambda mutation: RenameTodoSubscription(todo=mutation.todo))


class Subscription(graphene.ObjectType):
    add_todo = AddTodoSubscription.Field()
    change_todo_status = ChangeTodoStatusSubscription.Field()
    insert_todo = InsertTodoSubscription.Field()
    remove_todo = RemoveTodoSubscription.Field()
    rename_todo = RenameTodoSubscription.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
