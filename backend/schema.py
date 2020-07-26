import graphene
from sqlalchemy import and_, func
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, User as UserModel, Todo as TodoModel
import graphql_relay

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

    def resolve_todos(self, info, **kwargs):
        qs = self.todos
        status = kwargs.get('status', None)
        if status and status == 'completed':
            qs = qs.filter(TodoModel.complete == True)
        return qs.all()

    def resolve_total_count(self, info):
        return self.todos.count()

    def resolve_completed_count(self, info):
        return self.todos.filter(TodoModel.complete == True).count()


def get_viewer():
    return UserModel.query.filter(UserModel.name == 'me').first()


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    viewer = graphene.Field(User)

    def resolve_viewer(self, info):
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
        return AddTodo(todo_edge=edge, viewer=viewer)


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
        return ChangeTodoStatus(todo=todo, viewer=viewer)


class MarkAllTodos(relay.ClientIDMutation):
    # mutation MarkAllTodosMutation($input: MarkAllTodosInput!) {
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
        return RemoveTodo(deleted_todo_id=id, viewer=viewer)


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
        return RenameTodo(todo=todo)


class Mutation(graphene.ObjectType):
    add_todo = AddTodo.Field()
    change_todo_status = ChangeTodoStatus.Field()
    mark_all_todos = MarkAllTodos.Field()
    remove_completed_todos = RemoveCompletedTodos.Field()
    remove_todo = RemoveTodo.Field()
    rename_todo = RenameTodo.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
