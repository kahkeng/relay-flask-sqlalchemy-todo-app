/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type router_TodoApp_QueryVariables = {};
export type router_TodoApp_QueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"TodoApp_viewer">;
    } | null;
};
export type router_TodoApp_Query = {
    readonly response: router_TodoApp_QueryResponse;
    readonly variables: router_TodoApp_QueryVariables;
};



/*
query router_TodoApp_Query {
  viewer {
    ...TodoApp_viewer
    id
  }
}

fragment TodoApp_viewer on User {
  id
  ...TodoListFooter_viewer
}

fragment TodoListFooter_viewer on User {
  id
  completedCount
  completedTodos: todos(status: "completed", first: 2147483647) {
    edges {
      node {
        id
        complete
      }
    }
  }
  totalCount
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "router_TodoApp_Query",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TodoApp_viewer"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "router_TodoApp_Query",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedCount",
            "storageKey": null
          },
          {
            "alias": "completedTodos",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2147483647
              },
              {
                "kind": "Literal",
                "name": "status",
                "value": "completed"
              }
            ],
            "concreteType": "TodoConnection",
            "kind": "LinkedField",
            "name": "todos",
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
                      (v0/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "complete",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "todos(first:2147483647,status:\"completed\")"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1dfcfe922489b97cde002712d3d95ab1",
    "id": null,
    "metadata": {},
    "name": "router_TodoApp_Query",
    "operationKind": "query",
    "text": "query router_TodoApp_Query {\n  viewer {\n    ...TodoApp_viewer\n    id\n  }\n}\n\nfragment TodoApp_viewer on User {\n  id\n  ...TodoListFooter_viewer\n}\n\nfragment TodoListFooter_viewer on User {\n  id\n  completedCount\n  completedTodos: todos(status: \"completed\", first: 2147483647) {\n    edges {\n      node {\n        id\n        complete\n      }\n    }\n  }\n  totalCount\n}\n"
  }
};
})();
(node as any).hash = '16d22305f9a99ca9c4997a5653664f35';
export default node;
