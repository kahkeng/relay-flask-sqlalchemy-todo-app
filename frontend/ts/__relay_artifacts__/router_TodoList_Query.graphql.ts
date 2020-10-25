/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type router_TodoList_QueryVariables = {
    status: string;
};
export type router_TodoList_QueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": FragmentRefs<"TodoList_viewer">;
    } | null;
};
export type router_TodoList_Query = {
    readonly response: router_TodoList_QueryResponse;
    readonly variables: router_TodoList_QueryVariables;
};



/*
query router_TodoList_Query(
  $status: String!
) {
  viewer {
    ...TodoList_viewer
    id
  }
}

fragment StatusSubscriber_viewer on User {
  id
  totalCount
}

fragment TodoList_viewer on User {
  todos(status: $status, first: 2147483647) {
    edges {
      node {
        id
        complete
        ...Todo_todo
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  id
  totalCount
  completedCount
  ...Todo_viewer
  ...StatusSubscriber_viewer
}

fragment Todo_todo on Todo {
  complete
  id
  text
}

fragment Todo_viewer on User {
  id
  totalCount
  completedCount
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 2147483647
  },
  {
    "kind": "Variable",
    "name": "status",
    "variableName": "status"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "router_TodoList_Query",
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
            "name": "TodoList_viewer"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "router_TodoList_Query",
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
            "alias": null,
            "args": (v1/*: any*/),
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
                      (v2/*: any*/),
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
                        "name": "text",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
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
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": [
              "status"
            ],
            "handle": "connection",
            "key": "TodoList_todos",
            "kind": "LinkedHandle",
            "name": "todos"
          },
          (v2/*: any*/),
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1d66af43845d8a84272386e00bd6cd9f",
    "id": null,
    "metadata": {},
    "name": "router_TodoList_Query",
    "operationKind": "query",
    "text": "query router_TodoList_Query(\n  $status: String!\n) {\n  viewer {\n    ...TodoList_viewer\n    id\n  }\n}\n\nfragment StatusSubscriber_viewer on User {\n  id\n  totalCount\n}\n\nfragment TodoList_viewer on User {\n  todos(status: $status, first: 2147483647) {\n    edges {\n      node {\n        id\n        complete\n        ...Todo_todo\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n  totalCount\n  completedCount\n  ...Todo_viewer\n  ...StatusSubscriber_viewer\n}\n\nfragment Todo_todo on Todo {\n  complete\n  id\n  text\n}\n\nfragment Todo_viewer on User {\n  id\n  totalCount\n  completedCount\n}\n"
  }
};
})();
(node as any).hash = 'cad30f5b0c7a7db28590225a02908331';
export default node;
