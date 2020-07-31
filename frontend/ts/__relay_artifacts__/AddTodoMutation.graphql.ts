/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type AddTodoInput = {
    text: string;
    clientMutationId?: string | null;
};
export type AddTodoMutationVariables = {
    input: AddTodoInput;
};
export type AddTodoMutationResponse = {
    readonly addTodo: {
        readonly todoEdge: {
            readonly __typename: string;
            readonly cursor: string;
            readonly node: {
                readonly complete: boolean | null;
                readonly id: string;
                readonly text: string | null;
            } | null;
        } | null;
        readonly viewer: {
            readonly id: string;
            readonly totalCount: number | null;
        } | null;
    } | null;
};
export type AddTodoMutation = {
    readonly response: AddTodoMutationResponse;
    readonly variables: AddTodoMutationVariables;
};



/*
mutation AddTodoMutation(
  $input: AddTodoInput!
) {
  addTodo(input: $input) {
    todoEdge {
      __typename
      cursor
      node {
        complete
        id
        text
      }
    }
    viewer {
      id
      totalCount
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
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AddTodoPayload",
    "kind": "LinkedField",
    "name": "addTodo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TodoEdge",
        "kind": "LinkedField",
        "name": "todoEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cursor",
            "storageKey": null
          },
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
                "name": "complete",
                "storageKey": null
              },
              (v1/*: any*/),
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
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddTodoMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddTodoMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d3831ac28302344e5f8cf46456b5c4a9",
    "id": null,
    "metadata": {},
    "name": "AddTodoMutation",
    "operationKind": "mutation",
    "text": "mutation AddTodoMutation(\n  $input: AddTodoInput!\n) {\n  addTodo(input: $input) {\n    todoEdge {\n      __typename\n      cursor\n      node {\n        complete\n        id\n        text\n      }\n    }\n    viewer {\n      id\n      totalCount\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd83bc4fc4eabb0be2a540834905e9427';
export default node;
