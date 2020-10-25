/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type RemoveTodoSubscriptionInput = {
    clientSubscriptionId?: string | null;
};
export type RemoveTodoSubscriptionVariables = {
    input: RemoveTodoSubscriptionInput;
};
export type RemoveTodoSubscriptionResponse = {
    readonly removeTodo: {
        readonly deletedTodoId: string | null;
        readonly viewer: {
            readonly completedCount: number | null;
            readonly totalCount: number | null;
        } | null;
    } | null;
};
export type RemoveTodoSubscription = {
    readonly response: RemoveTodoSubscriptionResponse;
    readonly variables: RemoveTodoSubscriptionVariables;
};



/*
subscription RemoveTodoSubscription(
  $input: RemoveTodoSubscriptionInput!
) {
  removeTodo(input: $input) {
    deletedTodoId
    viewer {
      completedCount
      totalCount
      id
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
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedTodoId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedCount",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveTodoSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveTodoSubscriptionPayload",
        "kind": "LinkedField",
        "name": "removeTodo",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "viewer",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveTodoSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveTodoSubscriptionPayload",
        "kind": "LinkedField",
        "name": "removeTodo",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "viewer",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5177b75e1207b4e09c85724adcd7bf96",
    "id": null,
    "metadata": {},
    "name": "RemoveTodoSubscription",
    "operationKind": "subscription",
    "text": "subscription RemoveTodoSubscription(\n  $input: RemoveTodoSubscriptionInput!\n) {\n  removeTodo(input: $input) {\n    deletedTodoId\n    viewer {\n      completedCount\n      totalCount\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd1ff86aa6710f86a5c6818578196439d';
export default node;
