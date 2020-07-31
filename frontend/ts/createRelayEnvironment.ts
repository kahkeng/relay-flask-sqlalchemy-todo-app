import 'regenerator-runtime/runtime';

import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-modern';
import { Environment, RecordSource, Store } from 'relay-runtime';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';

export function createRelayEnvironment(relaySsr: RelayServerSSR | RelayClientSSR, url: string) {
  return new Environment({
    network: new RelayNetworkLayer([
      relaySsr.getMiddleware(),
      urlMiddleware({ url }),
    ]),
    store: new Store(new RecordSource()),
  });
}
