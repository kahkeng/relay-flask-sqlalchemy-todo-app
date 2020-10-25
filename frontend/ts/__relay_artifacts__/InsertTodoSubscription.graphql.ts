/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type InsertTodoSubscriptionInput = {
    status: string;
    clientSubscriptionId?: string | null;
};
export type InsertTodoSubscriptionVariables = {
    input: InsertTodoSubscriptionInput;
};
export type InsertTodoSubscriptionResponse = {
    readonly insertTodo: {
        readonly todoEdge: {
            readonly cursor: string;
            readonly node: {
                readonly id: string;
                readonly complete: boolean | null;
                readonly text: string | null;
            } | null;
        } | null;
        readonly viewer: {
            readonly id: string;
            readonly completedCount: number | null;
        } | null;
    } | null;
};
export type InsertTodoSubscription = {
    readonly response: InsertTodoSubscriptionResponse;
    readonly variables: InsertTodoSubscriptionVariables;
};



/*
subscription InsertTodoSubscription(
  $input: InsertTodoSubscriptionInput!
) {
  insertTodo(input: $input) {
    todoEdge {
      cursor
      node {
        id
        complete
        text
      }
    }
    viewer {
      id
      completedCount
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
    "concreteType": "InsertTodoSubscriptionPayload",
    "kind": "LinkedField",
    "name": "insertTodo",
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
            "name": "completedCount",
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
    "name": "InsertTodoSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "InsertTodoSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7e6b482da1407cf01981eb0fe5488c99",
    "id": null,
    "metadata": {},
    "name": "InsertTodoSubscription",
    "operationKind": "subscription",
    "text": "subscription InsertTodoSubscription(\n  $input: InsertTodoSubscriptionInput!\n) {\n  insertTodo(input: $input) {\n    todoEdge {\n      cursor\n      node {\n        id\n        complete\n        text\n      }\n    }\n    viewer {\n      id\n      completedCount\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd721062c4562f8d9b9c0e4af4e27a97e';
export default node;
