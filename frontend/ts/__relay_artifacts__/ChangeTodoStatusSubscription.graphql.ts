/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type ChangeTodoStatusSubscriptionInput = {
    id: string;
    clientSubscriptionId?: string | null;
};
export type ChangeTodoStatusSubscriptionVariables = {
    input: ChangeTodoStatusSubscriptionInput;
};
export type ChangeTodoStatusSubscriptionResponse = {
    readonly changeTodoStatus: {
        readonly todo: {
            readonly id: string;
            readonly complete: boolean | null;
        } | null;
        readonly viewer: {
            readonly id: string;
            readonly completedCount: number | null;
        } | null;
    } | null;
};
export type ChangeTodoStatusSubscription = {
    readonly response: ChangeTodoStatusSubscriptionResponse;
    readonly variables: ChangeTodoStatusSubscriptionVariables;
};



/*
subscription ChangeTodoStatusSubscription(
  $input: ChangeTodoStatusSubscriptionInput!
) {
  changeTodoStatus(input: $input) {
    todo {
      id
      complete
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
    "concreteType": "ChangeTodoStatusSubscriptionPayload",
    "kind": "LinkedField",
    "name": "changeTodoStatus",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Todo",
        "kind": "LinkedField",
        "name": "todo",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "complete",
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
    "name": "ChangeTodoStatusSubscription",
    "selections": (v2/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ChangeTodoStatusSubscription",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "485fbf9738e08681423b4a41baf65889",
    "id": null,
    "metadata": {},
    "name": "ChangeTodoStatusSubscription",
    "operationKind": "subscription",
    "text": "subscription ChangeTodoStatusSubscription(\n  $input: ChangeTodoStatusSubscriptionInput!\n) {\n  changeTodoStatus(input: $input) {\n    todo {\n      id\n      complete\n    }\n    viewer {\n      id\n      completedCount\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '3b5cb6f5ccd8d1442a5faa51a1e8ae10';
export default node;
