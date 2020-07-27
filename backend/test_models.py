from models import User, Todo


def test_basic():
    me = User.query.filter(User.name == 'me').first()
    assert me.todos.count() == 2
    assert me.todos.filter(Todo.complete == True).count() == 1
    assert [todo.text for todo in me.todos.all()] == ['Taste JavaScript', 'Buy a unicorn']

    other = User.query.filter(User.name == 'other').first()
    assert other.todos.count() == 2
    assert other.todos.filter(Todo.complete == True).count() == 1
    assert [todo.text for todo in other.todos.all()] == ['This should be hidden', 'Secret task']
