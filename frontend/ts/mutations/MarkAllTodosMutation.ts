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

import { TodoList_viewer } from "../__relay_artifacts__/TodoList_viewer.graphql"
import {
  ConnectionHandler,
  RecordSourceSelectorProxy,
  Environment,
} from "relay-runtime"
import { MarkAllTodosMutation } from "../__relay_artifacts__/MarkAllTodosMutation.graphql"

const mutation = graphql`
  mutation MarkAllTodosMutation($input: MarkAllTodosInput!, $status: String!) {
    markAllTodos(input: $input) {
      viewer {
        todos (status: $status) {
          edges {
            node {
              id
              complete
              text
            }
          }
        }
        id
        completedCount
      }
      changedTodos {
        id
        complete
      }
    }
  }
`

function commit(
  environment: Environment,
  complete: boolean,
  user: TodoList_viewer,
  status: string,
) {
  return commitMutation<MarkAllTodosMutation>(environment, {
    mutation,
    variables: {
      input: { complete },
      status,
    },

    updater: store => {
      const userProxy = store.get(user.id)!;
      const connection = ConnectionHandler.getConnection(
        userProxy,
        'TodoList_todos',
        { status },
      )!;
      const todoEdges = store
        .getRootField('markAllTodos')
        .getLinkedRecord('viewer')
        .getLinkedRecord('todos', { status })
        .getLinkedRecords('edges');
      connection.setLinkedRecords(todoEdges as any, 'edges');
    },

    optimisticUpdater(store) {
      const userProxy = store.get(user.id)!;
      const connection = ConnectionHandler.getConnection(
        userProxy,
        'TodoList_todos',
        { status },
      )!;

      if (
        (complete && status === 'active') ||
        (!complete && status === 'completed')
      ) {
        connection.setLinkedRecords([], 'edges');
      }

      connection.getLinkedRecords('edges')!.forEach((edge) => {
        edge.getLinkedRecord('node')!.setValue(complete, 'complete');
      });

      userProxy.setValue(
        complete ? userProxy.getValue('numTodos') : 0,
        'numCompletedTodos',
      );
    },
  })
}

export default { commit }
