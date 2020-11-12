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

import { Todo_viewer } from "../__relay_artifacts__/Todo_viewer.graphql"
import { RemoveTodoSubscription } from "../__relay_artifacts__/RemoveTodoSubscription.graphql"

const subscription = graphql`
  subscription RemoveTodoSubscription($input: RemoveTodoSubscriptionInput!) {
    removeTodo(input: $input) {
      deletedTodoId
      viewer {
        completedCount
        totalCount
      }
    }
  }
`

let tempID = 0

function subscribe(environment: Environment, user: Todo_viewer): Disposable {
  const subscriptionConfig = {
    subscription,
    variables: {
      input: {
        clientSubscriptionId: (tempID++).toString(),
      }
    },
    onError: (error: any) => console.error(error),
    updater: (store: RecordSourceSelectorProxy, data: any): void => {
      const rootField = store.getRootField('removeTodo')!
      const deletedID = rootField.getValue('deletedTodoId') as string
      const userProxy = store.get(user.id)!;
      ['any', 'active', 'completed'].forEach((status) => {
        const conn = ConnectionHandler.getConnection(userProxy, "TodoListPaged_todos", { status })
        if (conn) {
          ConnectionHandler.deleteNode(conn, deletedID)
        }
      })
    },
  };
  return requestSubscription<RemoveTodoSubscription>(environment, subscriptionConfig);
}

export default { subscribe }
