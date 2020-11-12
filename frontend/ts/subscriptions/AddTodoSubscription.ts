import {
  ReactRelayContext,
  graphql,
  requestSubscription,
} from 'react-relay';
import {
  ConnectionHandler,
  Environment,
  RecordSourceSelectorProxy,
  Disposable,
} from 'relay-runtime';

import { StatusSubscriber_viewer } from "../__relay_artifacts__/StatusSubscriber_viewer.graphql"
import { AddTodoSubscription } from "../__relay_artifacts__/AddTodoSubscription.graphql"

const subscription = graphql`
  subscription AddTodoSubscription($input: AddTodoSubscriptionInput!) {
    addTodo(input: $input) {
      todoEdge {
        node {
          id
          complete
          text
        }
      }
      viewer {
        id
        totalCount
      }
    }
  }
`

let tempID = 0

function subscribe(environment: Environment, user: StatusSubscriber_viewer, status: string): Disposable {
  const subscriptionConfig = {
    subscription,
    variables: {
      input: {
        status,
        clientSubscriptionId: (tempID++).toString(),
      }
    },
    onError: (error: any) => console.error(error),
    updater: (store: RecordSourceSelectorProxy, data: any): void => {
      const rootField = store.getRootField('addTodo')!;
      const viewer = rootField.getLinkedRecord('viewer')!;

      const totalCount = viewer.getValue('totalCount');
      const userProxy = store.get(user.id)!
      userProxy.setValue(
        totalCount as number,
        "totalCount",
      )

      const todoEdge = rootField.getLinkedRecord('todoEdge');
      if (todoEdge) {
        const conn = ConnectionHandler.getConnection(viewer, 'TodoListPaged_todos', { status })!;
        // TODO: somehow, we need to create a new edge here. Inserting the edge above
        // causes issues with duplicate keys.
        //ConnectionHandler.insertEdgeAfter(conn, todoEdge);
        const todo = todoEdge.getLinkedRecord('node')!;
        const edge = ConnectionHandler.createEdge(store, conn, todo, 'todoEdge');
        ConnectionHandler.insertEdgeBefore(conn, edge);
      }
    },
  };
  return requestSubscription<AddTodoSubscription>(environment, subscriptionConfig);
}

export default { subscribe }
