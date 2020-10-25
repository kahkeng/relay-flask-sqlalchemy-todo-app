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
import { RenameTodoSubscription } from "../__relay_artifacts__/RenameTodoSubscription.graphql"

const subscription = graphql`
  subscription RenameTodoSubscription($input: RenameTodoSubscriptionInput!) {
    renameTodo(input: $input) {
      todo {
        id
        text
      }
    }
  }
`

let tempID = 0

function subscribe(environment: Environment): Disposable {
  const subscriptionConfig = {
    subscription,
    variables: {
      input: {
        clientSubscriptionId: (tempID++).toString(),
      }
    },
    onError: (error: any) => console.error(error),
  };
  return requestSubscription<RenameTodoSubscription>(environment, subscriptionConfig);
}

export default { subscribe }
