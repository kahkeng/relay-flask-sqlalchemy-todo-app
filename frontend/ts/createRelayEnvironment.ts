import 'regenerator-runtime/runtime';

import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-modern';
import {
  Environment, RecordSource, Store,
  RequestParameters, CacheConfig, Variables, Observable, GraphQLResponse
} from 'relay-runtime';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

import { SubscriptionClient } from 'subscriptions-transport-ws';

import config from './config'

const GRAPHQL_SUBSCRIPTION_ENDPOINT = `ws://${config.BACKEND_HOST}:${config.BACKEND_PORT}/subscriptions`;

export function createRelayEnvironment(relaySsr: RelayServerSSR | RelayClientSSR, url: string) {
  let options
  if (relaySsr instanceof RelayClientSSR) {
    const subscriptionClient = new SubscriptionClient(GRAPHQL_SUBSCRIPTION_ENDPOINT, {
      reconnect: true,
    });
    options = {
      subscribeFn: (
        request: RequestParameters,
        variables: Variables,
        cacheConfig: CacheConfig,
      ): Observable<GraphQLResponse> => {
        const subscribeObservable = subscriptionClient.request({
          query: request.text || undefined,
          operationName: request.name,
          variables,
        });
        // Important: Convert subscriptions-transport-ws observable type to Relay's
        return Observable.from(subscribeObservable as any);
      },
    };
  }
  return new Environment({
    network: new RelayNetworkLayer([
      relaySsr.getMiddleware(),
      urlMiddleware({ url }),
    ], options as any),
    store: new Store(new RecordSource()),
  });
}
