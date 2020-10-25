/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type AddTodoSubscriptionInput = {
    status: string;
    clientSubscriptionId?: string | null;
};
export type AddTodoSubscriptionVariables = {
    input: AddTodoSubscriptionInput;
};
export type AddTodoSubscriptionResponse = {
    readonly addTodo: {
        readonly todoEdge: {
            readonly node: {
                readonly id: string;
                readonly complete: boolean | null;
                readonly text: string | null;
            } | null;
        } | null;
        readonly viewer: {
            readonly id: string;
            readonly totalCount: number | null;
        } | null;
    } | null;
};
export type AddTodoSubscription = {
    readonly response: AddTodoSubscriptionResponse;
    readonly variables: AddTodoSubscriptionVariables;
};



/*
subscription AddTodoSubscription(
  $input: AddTodoSubscriptionInput!
) {
  addTodo(input: $input) {
    todoEdge {
      node {
        id
        complete
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
    "concreteType": "AddTodoSubscriptionPayload",
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
            "concreteType": "Todo",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
    "name": "AddTodoSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddTodoSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "52dbaab00dc4a3a8fce68199fb464410",
    "id": null,
    "metadata": {},
    "name": "AddTodoSubscription",
    "operationKind": "subscription",
    "text": "subscription AddTodoSubscription(\n  $input: AddTodoSubscriptionInput!\n) {\n  addTodo(input: $input) {\n    todoEdge {\n      node {\n        id\n        complete\n        text\n      }\n    }\n    viewer {\n      id\n      totalCount\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd2bdd899e3baba9ac72812792353342c';
export default node;
