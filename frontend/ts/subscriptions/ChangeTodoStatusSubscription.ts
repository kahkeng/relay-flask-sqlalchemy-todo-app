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

import { Todo_todo } from "../__relay_artifacts__/Todo_todo.graphql"
import { Todo_viewer } from "../__relay_artifacts__/Todo_viewer.graphql"
import { ChangeTodoStatusSubscription } from "../__relay_artifacts__/ChangeTodoStatusSubscription.graphql"

const subscription = graphql`
  subscription ChangeTodoStatusSubscription($input: ChangeTodoStatusSubscriptionInput!) {
    changeTodoStatus(input: $input) {
      todo {
        id
        complete
      }
      viewer {
        id
        completedCount
      }
    }
  }
`

let tempID = 0

function subscribe(environment: Environment, todo: Todo_todo, user: Todo_viewer): Disposable {
  const subscriptionConfig = {
    subscription,
    variables: {
      input: {
        id: todo.id,
        clientSubscriptionId: (tempID++).toString(),
      }
    },
    onError: (error: any) => console.error(error),
    updater: (store: RecordSourceSelectorProxy, data: any): void => {
      const rootField = store.getRootField('changeTodoStatus')!;
      const todoProxy = rootField.getLinkedRecord('todo')!;
      const userProxy = store.get(user.id)!;
      // Check if we need to remove from connection
      const status = todoProxy.getValue('complete') ? 'active' : 'completed';
      const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos', { status });
      if (conn) {
        ConnectionHandler.deleteNode(conn, todoProxy.getValue('id') as string);
      }
    },
  };
  return requestSubscription<ChangeTodoStatusSubscription>(environment, subscriptionConfig);
}

export default { subscribe }
