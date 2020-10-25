/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type StatusSubscriber_viewer = {
    readonly id: string;
    readonly totalCount: number | null;
    readonly " $refType": "StatusSubscriber_viewer";
};
export type StatusSubscriber_viewer$data = StatusSubscriber_viewer;
export type StatusSubscriber_viewer$key = {
    readonly " $data"?: StatusSubscriber_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"StatusSubscriber_viewer">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StatusSubscriber_viewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = '7b0773bf3ada53c356e9ec68f8eb9e0c';
export default node;
