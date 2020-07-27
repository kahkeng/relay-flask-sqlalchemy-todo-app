from graphene.test import Client
from schema import schema


def test_basic_query():
    client = Client(schema)
    executed = client.execute('''
query {
  user (id: "VXNlcjox") {
    name
  }
}
''')
    assert executed == {
        'data': {
            'user': {
                'name': 'me',
            },
        },
    }


def test_all_users_query():
    client = Client(schema)
    executed = client.execute('''
query {
  allUsers {
    edges {
      node {
        id
        name
      }
    }
  }
}
''')
    assert executed == {
        'data': {
            'allUsers': {
                'edges': [{
                    'node': {
                        'id': 'VXNlcjox',
                        'name': 'me'
                    }
                }, {
                    'node': {
                        'id': 'VXNlcjoy',
                        'name': 'other'
                    }
                }]
            },
        },
    }


def test_viewer_query():
    client = Client(schema)
    executed = client.execute('''
query {
  viewer {
    totalCount
    completedCount
    todos {
      edges {
        node {
          id
          complete
          text
        }
      }
    }
    anyTodos: todos (status: "any") {
      edges {
        node {
          id
          complete
          text
        }
      }
    }
    completedTodos: todos (status: "completed") {
      edges {
        node {
          id
          complete
          text
        }
      }
    }
  }
}
''')
    completed_todo = {
        'node': {
            'id': 'VG9kbzox',
            'complete': True,
            'text': 'Taste JavaScript',
        },
    }
    remaining_todo = {
        'node': {
            'id': 'VG9kbzoy',
            'complete': False,
            'text': 'Buy a unicorn',
        },
    }
    assert executed == {
        'data': {
            'viewer': {
                'totalCount': 2,
                'completedCount': 1,
                'todos': {
                    'edges': [
                        completed_todo,
                        remaining_todo,
                    ],
                },
                'anyTodos': {
                    'edges': [
                        completed_todo,
                        remaining_todo,
                    ],
                },
                'completedTodos': {
                    'edges': [
                        completed_todo,
                    ],
                },
            },
        },
    }


def test_mutation():
    client = Client(schema)
    executed = client.execute('''
query {
  user (id: "VXNlcjox") {
    completedCount
  }
  todo (id: "VG9kbzox") {
    complete
    text
  }
}
''')
    assert executed == {
        'data': {
            'user': {
                'completedCount': 1,
            },
            'todo': {
                'complete': True,
                'text': 'Taste JavaScript',
            },
        },
    }

    variables = {
        'input': {
            'id': 'VG9kbzox',
            'complete': False,
            'clientMutationId': 0,
        }
    }
    executed = client.execute('''
mutation ($input: ChangeTodoStatusInput!) {
  changeTodoStatus(input: $input) {
    todo { id complete }
    viewer { id completedCount }
  }
}''', variable_values=variables)
    assert executed == {
        'data': {
            'changeTodoStatus': {
                'todo': {
                    'id': 'VG9kbzox',
                    'complete': False,
                },
                'viewer': {
                    'id': 'VXNlcjox',
                    'completedCount': 0,
                },
            },
        },
    }

    executed = client.execute('''
query {
  user (id: "VXNlcjox") {
    completedCount
  }
  todo (id: "VG9kbzox") {
    complete
    text
  }
}
''')
    assert executed == {
        'data': {
            'user': {
                'completedCount': 0,
            },
            'todo': {
                'complete': False,
                'text': 'Taste JavaScript',
            },
        },
    }

    # revert changes
    variables = {
        'input': {
            'id': 'VG9kbzox',
            'complete': True,
            'clientMutationId': 0,
        },
    }
    executed = client.execute('''
mutation ($input: ChangeTodoStatusInput!) {
  changeTodoStatus(input: $input) {
    todo { id complete }
    viewer { id completedCount }
  }
}''', variable_values=variables)
    assert executed == {
        'data': {
            'changeTodoStatus': {
                'todo': {
                    'id': 'VG9kbzox',
                    'complete': True,
                },
                'viewer': {
                    'id': 'VXNlcjox',
                    'completedCount': 1,
                },
            },
        },
    }
