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

import Todo from './Todo';

import * as React from 'react';
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
} from 'react-relay';

import { TodoListPaged_viewer } from '../__relay_artifacts__/TodoListPaged_viewer.graphql';

import config from '../config';

interface Props {
  relay: RelayPaginationProp,
  viewer: TodoListPaged_viewer,
}

class TodoListPaged extends React.Component<Props> {
  timeout: NodeJS.Timeout | undefined;

  componentDidMount() {
    if (this.props.relay.hasMore()) {
      this.timeout = setTimeout(() => {
        this.props.relay.loadMore(config.PAGE_SIZE)
      }, 0);
    }
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (prevProps.relay.hasMore()) {
      this.timeout = setTimeout(() => {
        prevProps.relay.loadMore(config.PAGE_SIZE)
      }, 0);
    }
  }
  renderTodos() {
    return this.props.viewer.todos!.edges!.map(edge => {
      const node = edge!.node!;
      return <Todo
        key={node.id}
        todo={node}
        viewer={this.props.viewer}
      />
    });
  }
  render() {
    return (
      <ul className="todo-list">
        {this.renderTodos()}
        {
          this.props.relay.hasMore() && (
            <li>Loading more...</li>
          )
        }
      </ul>
    );
  }
}

export default createPaginationContainer(TodoListPaged,
  {
    viewer: graphql`
      fragment TodoListPaged_viewer on User {
        todos(
          status: $status,
          first: $count,
          after: $after
        ) @connection(key: "TodoListPaged_todos") {
          edges {
            node {
              id,
              complete,
              ...Todo_todo,
            },
          },
          pageInfo {
            hasNextPage,
            endCursor,
          }
        },
        ...Todo_viewer,
      }
    `,
  }, {
    direction: 'forward',
    query: graphql`
      query TodoListPagedForwardQuery(
        $status: String!,
        $count: Int!,
        $after: String,
      ) {
        viewer {
          ...TodoListPaged_viewer
        }
      }
    `,
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.todos
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      }
    },
    getVariables(props, paginationInfo, fragmentVariables) {
      return {
        status: fragmentVariables.status,
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      }
    },
  }
);
