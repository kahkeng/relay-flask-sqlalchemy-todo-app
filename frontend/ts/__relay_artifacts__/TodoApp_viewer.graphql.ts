/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TodoApp_viewer = {
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"TodoListFooter_viewer">;
    readonly " $refType": "TodoApp_viewer";
};
export type TodoApp_viewer$data = TodoApp_viewer;
export type TodoApp_viewer$key = {
    readonly " $data"?: TodoApp_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"TodoApp_viewer">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TodoApp_viewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TodoListFooter_viewer"
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = '8ba92a6f137d22386635f08a47260bc3';
export default node;
