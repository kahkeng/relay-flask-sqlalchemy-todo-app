from models import engine, db_session, Base, User, Todo
Base.metadata.create_all(bind=engine)

# Fill the tables with some data
viewer = User(name='me')

todo1 = Todo(user=viewer, text='Taste JavaScript', complete=True)
todo2 = Todo(user=viewer, text='Buy a unicorn', complete=False)

# Add another person to ensure we don't leak data
other = User(name='other')

todo3 = Todo(user=other, text='This should be hidden', complete=True)
todo4 = Todo(user=other, text='Secret task', complete=False)

db_session.add_all([viewer, other, todo1, todo2, todo3, todo4])
db_session.commit()
