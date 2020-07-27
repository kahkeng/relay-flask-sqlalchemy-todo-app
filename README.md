# relay-examples-todo-flask-ts
TodoMVC using React/Relay/Typescript frontend, Flask/Graphene/SQLAlchemy backend

## Prerequisites

* Python3
* Yarn

## Installation

Set up the backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
flask run
```

Set up the frontend

```
cd frontend
yarn install
```

Build the schema and Relay bindings

```
yarn update-schema
yarn build
```

Start frontend server

```
yarn start
```

Visit http://localhost:3000


## Credits

* https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
* https://github.com/relay-tools/relay-compiler-language-typescript
* https://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/
* https://github.com/smbolton/relay-examples-todo-graphene
