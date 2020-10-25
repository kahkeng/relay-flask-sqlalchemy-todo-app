// This component is reloaded whenever the status tab changes.

import * as React from 'react';
import {
  createFragmentContainer,
  graphql,
  RelayProp,
} from 'react-relay';
import { Disposable } from 'relay-runtime';

import AddTodoSubscription from '../subscriptions/AddTodoSubscription';
import InsertTodoSubscription from '../subscriptions/InsertTodoSubscription';
import { StatusSubscriber_viewer } from '../__relay_artifacts__/StatusSubscriber_viewer.graphql';

interface Props {
  relay: RelayProp,
  viewer: StatusSubscriber_viewer,
  status: string,
}

interface State {
  subscriptions: Disposable[],
}

class StatusSubscriber extends React.Component<Props> {
  state = {
    subscriptions: [] as Disposable[],
  };

  componentDidMount() {
    this.setState({
      subscriptions: [
        AddTodoSubscription.subscribe(
          this.props.relay.environment,
          this.props.viewer,
          this.props.status,
        ),
        InsertTodoSubscription.subscribe(
          this.props.relay.environment,
          this.props.viewer,
          this.props.status,
        ),
      ],
    });
  }
  componentWillUnmount() {
    this.state.subscriptions.forEach((subscription) => {
      subscription.dispose();
    });
  }
  render() {
    return null;
  }
}

export default createFragmentContainer(StatusSubscriber, {
  viewer: graphql`
    fragment StatusSubscriber_viewer on User {
      id,
      totalCount
    }
  `,
});
