# TodoMVC using React/Relay/Typescript frontend, Flask/Graphene/SQLAlchemy backend

## Motivation

The [Relay](https://relay.dev) quick start [guide](https://relay.dev/docs/en/quick-start-guide) references an [example todo list app](https://github.com/relayjs/relay-examples/tree/master/todo), but it is uses JavaScript with a mocked (non-persistent) database. There is a TypeScript [port](https://github.com/relay-tools/relay-compiler-language-typescript/tree/master/example) of this example app, and some online guides of using [Flask as backend to React](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project) and [Graphene/SQLAlchemy as a backend to GraphQL/Relay](https://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/), but nothing that combines all of these into fully-featured example app (e.g. with mutations). The closest example was an implementation with a [Graphene/Django backend](https://github.com/smbolton/relay-examples-todo-graphene).

This repository (released with MIT License) adapts code from all the above sources to provide an example [TodoMVC](http://todomvc.com) app implementation that utilizes the following tech stack: Relay, Typescript, Flask, Graphene, SQLAlchemy. It could serve as a starting point for further customization.

## Prerequisites

* [Python3](https://www.python.org)
* [NodeJS](https://nodejs.org)
* [Yarn](https://yarnpkg.com)

## Installation

Set up the backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Seed the database

```
python seed.py
```

Run tests (optional)

```
pytest
```

Start backend server

```
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
