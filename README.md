# TodoMVC using React/Relay/Found/SSR/Typescript frontend, Flask/Graphene/SQLAlchemy/GraphQL-WebSockets/Gevent backend

## Summary

This repository (released with MIT License) adapts code from various sources to provide an example [TodoMVC](http://todomvc.com) app implementation that utilizes the following tech stack: Relay, Found, Typescript, Flask, Graphene, SQLAlchemy, GraphQL-Websockets, Gevent. It could serve as a starting point for further customization.

For earlier versions without some optional features, check out the following branches:
* without pagination: [without_pagination](https://github.com/kahkeng/relay-flask-sqlalchemy-todo-app/tree/without_pagination)
* without subscriptions: [without_subscriptions](https://github.com/kahkeng/relay-flask-sqlalchemy-todo-app/tree/without_subscriptions)
* without Found/SSR: [without_found_ssr](https://github.com/kahkeng/relay-flask-sqlalchemy-todo-app/tree/without_found_ssr)

## Motivation

The [Relay](https://relay.dev) quick start [guide](https://relay.dev/docs/en/quick-start-guide) references an [example todo list app](https://github.com/relayjs/relay-examples/tree/master/todo), but it is uses JavaScript with a mocked (non-persistent) database. There is a TypeScript [port](https://github.com/relay-tools/relay-compiler-language-typescript/tree/master/example) of this example app, and some online guides of using [Flask as backend to React](https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project) and [Graphene/SQLAlchemy as a backend to GraphQL/Relay](https://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/), but nothing that combines all of these into fully-featured example app (e.g. with mutations and subscriptions). The closest example was an implementation with a [Graphene/Django backend](https://github.com/smbolton/relay-examples-todo-graphene) but not one using Flask. This repository integrates from the above sources and show-cases a full-fledged app with our desired tech stack working cohesively together.

We add on routing and server-side rendering (SSR) with Found/Found-Relay by referencing [this example](https://github.com/relay-tools/found-relay/tree/master/examples/todomvc-universal). We also introduce subscriptions by referencing several implementations ([graphql-ws with gevent](https://github.com/graphql-python/graphql-ws/tree/master/examples/flask_gevent), [pubsub example](https://github.com/graphql-python/graphql-ws/pull/11), [relay example](https://github.com/jeremy-colin/relay-examples-subscription)), so multiple windows of the application will stay in sync with backend updates. We also introduce automatic paging of the list at load time to reduce initial page load time.

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
python app.py
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

Visit http://localhost:3000 in multiple windows and see updates reflected in all of them.


## Credits

* https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project
* https://github.com/relay-tools/relay-compiler-language-typescript
* https://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/
* https://github.com/smbolton/relay-examples-todo-graphene
* https://github.com/relay-tools/found-relay/tree/master/examples/todomvc-universal
* https://github.com/graphql-python/graphql-ws/tree/master/examples/flask_gevent
* https://github.com/jeremy-colin/relay-examples-subscription
* https://github.com/hballard/graphql-ws/tree/pubsub
* https://github.com/graphql-python/graphql-ws/pull/11
* https://www.howtographql.com/react-relay/8-pagination/