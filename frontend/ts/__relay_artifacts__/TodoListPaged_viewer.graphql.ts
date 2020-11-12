/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TodoListPaged_viewer = {
    readonly todos: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly complete: boolean | null;
                readonly " $fragmentRefs": FragmentRefs<"Todo_todo">;
            } | null;
        } | null>;
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly endCursor: string | null;
        };
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Todo_viewer">;
    readonly " $refType": "TodoListPaged_viewer";
};
export type TodoListPaged_viewer$data = TodoListPaged_viewer;
export type TodoListPaged_viewer$key = {
    readonly " $data"?: TodoListPaged_viewer$data;
    readonly " $fragmentRefs": FragmentRefs<"TodoListPaged_viewer">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "count"
    },
    {
      "kind": "RootArgument",
      "name": "status"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "after",
        "direction": "forward",
        "path": [
          "todos"
        ]
      }
    ]
  },
  "name": "TodoListPaged_viewer",
  "selections": [
    {
      "alias": "todos",
      "args": [
        {
          "kind": "Variable",
          "name": "status",
          "variableName": "status"
        }
      ],
      "concreteType": "TodoConnection",
      "kind": "LinkedField",
      "name": "__TodoListPaged_todos_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TodoEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Todo",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
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
                  "name": "complete",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Todo_todo"
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Todo_viewer"
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = '5c31cbaf0efa715c63921ca745febceb';
export default node;
