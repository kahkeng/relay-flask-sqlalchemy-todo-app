/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { commitMutation, graphql } from "react-relay"
import {
  ConnectionHandler,
  RecordSourceSelectorProxy,
  Environment,
} from "relay-runtime"

import { Todo_todo } from "../__relay_artifacts__/Todo_todo.graphql"
import { Todo_viewer } from "../__relay_artifacts__/Todo_viewer.graphql"
import { ChangeTodoStatusMutation } from "../__relay_artifacts__/ChangeTodoStatusMutation.graphql"

const mutation = graphql`
  mutation ChangeTodoStatusMutation($input: ChangeTodoStatusInput!) {
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

function sharedUpdater(
  store: RecordSourceSelectorProxy,
  user: Todo_viewer,
  todoProxy: any,
) {
  // In principle this could add to the active connection, but such an
  // interaction is not possible from the front end.
  const userProxy = store.get(user.id);
  if (!userProxy) throw new Error("assertion failed")
  const status = todoProxy.getValue('complete') ? 'active' : 'completed';
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TodoList_todos',
    { status },
  );
  if (connection) {
    ConnectionHandler.deleteNode(connection, todoProxy.getValue('id'));
  }
}

function getOptimisticResponse(
  complete: boolean,
  todo: Todo_todo,
  user: Todo_viewer,
) {
  const viewerPayload: { id: string; completedCount: number | null } = {
    id: user.id,
    completedCount: null,
  }
  if (user.completedCount != null) {
    viewerPayload.completedCount = complete
      ? user.completedCount + 1
      : user.completedCount - 1
  }
  return {
    changeTodoStatus: {
      todo: {
        complete: complete,
        id: todo.id,
      },
      viewer: viewerPayload,
    },
  }
}

function commit(
  environment: Environment,
  complete: boolean,
  todo: Todo_todo,
  user: Todo_viewer,
) {
  return commitMutation<ChangeTodoStatusMutation>(environment, {
    mutation,
    variables: {
      input: { complete, id: todo.id },
    },
    updater: store => {
      const payload = store.getRootField("changeTodoStatus")
      if (!payload) throw new Error("assertion failed")
      sharedUpdater(store, user, payload.getLinkedRecord("todo"))
    },
    optimisticResponse: getOptimisticResponse(complete, todo, user),
  })
}

export default { commit }
