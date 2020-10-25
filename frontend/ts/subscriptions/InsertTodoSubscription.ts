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
import { InsertTodoSubscription } from "../__relay_artifacts__/InsertTodoSubscription.graphql"

const subscription = graphql`
  subscription InsertTodoSubscription($input: InsertTodoSubscriptionInput!) {
    insertTodo(input: $input) {
      todoEdge {
        cursor
        node {
          id
          complete
          text
        }
      }
      viewer {
        id
        completedCount
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
      const rootField = store.getRootField('insertTodo')!;
      const todoEdge = rootField.getLinkedRecord('todoEdge')!;
      const viewer = rootField.getLinkedRecord('viewer')!;

      const completedCount = viewer.getValue('completedCount');
      const userProxy = store.get(user.id)!
      userProxy.setValue(
        completedCount as number,
        "completedCount",
      )

      const cursor = todoEdge.getValue('cursor')!;
      const conn = ConnectionHandler.getConnection(viewer, 'TodoList_todos', { status })!;
      // TODO: somehow, we need to create a new edge here. Inserting the edge above
      // causes issues with duplicate keys.
      // Also, cursor-based insertion sometimes doesn't seem to work properly.
      //ConnectionHandler.insertEdgeAfter(conn, todoEdge, cursor as string);
      const todo = todoEdge.getLinkedRecord('node')!;
      const edge = ConnectionHandler.createEdge(store, conn, todo, 'todoEdge');
      ConnectionHandler.insertEdgeBefore(conn, edge, cursor as string);
    },
  };
  return requestSubscription<InsertTodoSubscription>(environment, subscriptionConfig);
}

export default { subscribe }
