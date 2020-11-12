import queryMiddleware from 'farce/queryMiddleware';
import Route from 'found/Route';
import makeRouteConfig from 'found/makeRouteConfig';
import * as React from 'react';
import { graphql } from 'react-relay';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';

import config from './config';

export const historyMiddlewares = [queryMiddleware];

const TodoListQuery = graphql`
  query router_TodoList_Query(
    $status: String!,
    $count: Int!,
    $after: String,
  ) {
    viewer {
      ...TodoList_viewer
    }
  }
`;

export const routeConfig = makeRouteConfig(
  <Route
    path="/"
    Component={TodoApp}
    query={graphql`
      query router_TodoApp_Query {
        viewer {
          ...TodoApp_viewer
        }
      }
    `}
  >
    <Route
      Component={TodoList}
      query={TodoListQuery}
      prepareVariables={(params: any) => ({ ...params, status: 'any', count: config.PAGE_SIZE })}
    />
    <Route
      path=":status"
      Component={TodoList}
      query={TodoListQuery}
      prepareVariables={(params: any) => ({ ...params, count: config.PAGE_SIZE })}
    />
  </Route>,
);
