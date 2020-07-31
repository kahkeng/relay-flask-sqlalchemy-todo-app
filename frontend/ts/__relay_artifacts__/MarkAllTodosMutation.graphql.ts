/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type MarkAllTodosInput = {
    complete: boolean;
    clientMutationId?: string | null;
};
export type MarkAllTodosMutationVariables = {
    input: MarkAllTodosInput;
    status: string;
};
export type MarkAllTodosMutationResponse = {
    readonly markAllTodos: {
        readonly viewer: {
            readonly todos: {
                readonly edges: ReadonlyArray<{
                    readonly node: {
                        readonly id: string;
                        readonly complete: boolean | null;
                        readonly text: string | null;
                    } | null;
                } | null>;
            } | null;
            readonly id: string;
            readonly completedCount: number | null;
        } | null;
        readonly changedTodos: ReadonlyArray<{
            readonly id: string;
            readonly complete: boolean | null;
        } | null> | null;
    } | null;
};
export type MarkAllTodosMutation = {
    readonly response: MarkAllTodosMutationResponse;
    readonly variables: MarkAllTodosMutationVariables;
};



/*
mutation MarkAllTodosMutation(
  $input: MarkAllTodosInput!
  $status: String!
) {
  markAllTodos(input: $input) {
    viewer {
      todos(status: $status) {
        edges {
          node {
            id
            complete
            text
          }
        }
      }
      id
      completedCount
    }
    changedTodos {
      id
      complete
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "complete",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MarkAllTodosPayload",
    "kind": "LinkedField",
    "name": "markAllTodos",
    "plural": false,
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
            "args": [
              {
                "kind": "Variable",
                "name": "status",
                "variableName": "status"
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
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "text",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Todo",
        "kind": "LinkedField",
        "name": "changedTodos",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MarkAllTodosMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MarkAllTodosMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "de9ce2c85b7aa25a352c06ac24bc4a19",
    "id": null,
    "metadata": {},
    "name": "MarkAllTodosMutation",
    "operationKind": "mutation",
    "text": "mutation MarkAllTodosMutation(\n  $input: MarkAllTodosInput!\n  $status: String!\n) {\n  markAllTodos(input: $input) {\n    viewer {\n      todos(status: $status) {\n        edges {\n          node {\n            id\n            complete\n            text\n          }\n        }\n      }\n      id\n      completedCount\n    }\n    changedTodos {\n      id\n      complete\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c3abdfb7a7951673290b36550f6f8c76';
export default node;
