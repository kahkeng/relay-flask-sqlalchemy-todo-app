/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TodoList_viewer = {
    readonly id: string;
    readonly totalCount: number | null;
    readonly completedCount: number | null;
    readonly " $fragmentRefs": FragmentRefs<"TodoListPaged_viewer" | "StatusSubscriber_viewer">;
    readonly " $refType": "TodoList_viewer";
};
export type TodoList_viewer$data = TodoList_viewer;
export type TodoList_viewer$key = {
    readonly " $data"?: TodoList_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"TodoList_viewer">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TodoList_viewer",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedCount",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TodoListPaged_viewer"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "StatusSubscriber_viewer"
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = '1d2b6ccb4843530182301b00167f45e1';
export default node;
