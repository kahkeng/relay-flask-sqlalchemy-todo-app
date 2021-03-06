/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type router_TodoList_QueryVariables = {
    status: string;
    count: number;
    after?: string | null;
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
  $count: Int!
  $after: String
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

fragment TodoListPaged_viewer on User {
  todos(status: $status, first: $count, after: $after) {
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
      hasNextPage
      endCursor
    }
  }
  ...Todo_viewer
}

fragment TodoList_viewer on User {
  id
  totalCount
  completedCount
  ...TodoListPaged_viewer
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
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Variable",
    "name": "status",
    "variableName": "status"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
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
          (v3/*: any*/),
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
            "alias": null,
            "args": (v4/*: any*/),
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
                      (v3/*: any*/),
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
            "alias": null,
            "args": (v4/*: any*/),
            "filters": [
              "status"
            ],
            "handle": "connection",
            "key": "TodoListPaged_todos",
            "kind": "LinkedHandle",
            "name": "todos"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5b18ad6996c6e03460194381a79d36a2",
    "id": null,
    "metadata": {},
    "name": "router_TodoList_Query",
    "operationKind": "query",
    "text": "query router_TodoList_Query(\n  $status: String!\n  $count: Int!\n  $after: String\n) {\n  viewer {\n    ...TodoList_viewer\n    id\n  }\n}\n\nfragment StatusSubscriber_viewer on User {\n  id\n  totalCount\n}\n\nfragment TodoListPaged_viewer on User {\n  todos(status: $status, first: $count, after: $after) {\n    edges {\n      node {\n        id\n        complete\n        ...Todo_todo\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  ...Todo_viewer\n}\n\nfragment TodoList_viewer on User {\n  id\n  totalCount\n  completedCount\n  ...TodoListPaged_viewer\n  ...StatusSubscriber_viewer\n}\n\nfragment Todo_todo on Todo {\n  complete\n  id\n  text\n}\n\nfragment Todo_viewer on User {\n  id\n  totalCount\n  completedCount\n}\n"
  }
};
})();
(node as any).hash = '46d10e772260fed394be5a603b28652c';
export default node;
