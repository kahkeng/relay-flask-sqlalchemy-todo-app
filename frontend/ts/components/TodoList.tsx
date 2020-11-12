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

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';

import * as React from 'react';
import {
  ReactRelayContext,
  createFragmentContainer,
  graphql,
  RelayProp,
} from 'react-relay';

import { TodoList_viewer } from '../__relay_artifacts__/TodoList_viewer.graphql';
import { ChangeEvent } from 'react';

import TodoListPaged from './TodoListPaged';
import StatusSubscriber from './StatusSubscriber';

interface Props {
  relay: RelayProp,
  viewer: TodoList_viewer
}

class TodoList extends React.Component<Props> {
  static contextType = ReactRelayContext

  _handleMarkAllChange = (e: ChangeEvent<HTMLInputElement>) => {
    const complete = e.target.checked;
    MarkAllTodosMutation.commit(
      this.props.relay.environment,
      complete,
      this.props.viewer,
      this.context.variables.status,
    );
  };
  render() {
    const numTodos = this.props.viewer.totalCount;
    const numCompletedTodos = this.props.viewer.completedCount;
    return (
      <section className="main">
        <input
          id="toggle-all"
          checked={numTodos === numCompletedTodos}
          className="toggle-all"
          onChange={this._handleMarkAllChange}
          type="checkbox"
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <TodoListPaged viewer={this.props.viewer}/>
        <StatusSubscriber
          key={this.context.variables.status}
          status={this.context.variables.status}
          viewer={this.props.viewer}
        />
      </section>
    );
  }
}

export default createFragmentContainer(TodoList, {
  viewer: graphql`
    fragment TodoList_viewer on User {
      id,
      totalCount,
      completedCount,
      ...TodoListPaged_viewer,
      ...StatusSubscriber_viewer,
    }
  `,
});
