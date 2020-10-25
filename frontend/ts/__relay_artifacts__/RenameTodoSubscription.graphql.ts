/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type RenameTodoSubscriptionInput = {
    clientSubscriptionId?: string | null;
};
export type RenameTodoSubscriptionVariables = {
    input: RenameTodoSubscriptionInput;
};
export type RenameTodoSubscriptionResponse = {
    readonly renameTodo: {
        readonly todo: {
            readonly id: string;
            readonly text: string | null;
        } | null;
    } | null;
};
export type RenameTodoSubscription = {
    readonly response: RenameTodoSubscriptionResponse;
    readonly variables: RenameTodoSubscriptionVariables;
};



/*
subscription RenameTodoSubscription(
  $input: RenameTodoSubscriptionInput!
) {
  renameTodo(input: $input) {
    todo {
      id
      text
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "RenameTodoSubscriptionPayload",
    "kind": "LinkedField",
    "name": "renameTodo",
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
            "name": "text",
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
    "name": "RenameTodoSubscription",
    "selections": (v1/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RenameTodoSubscription",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d04a859320b10d7cdb703e1296b70c7e",
    "id": null,
    "metadata": {},
    "name": "RenameTodoSubscription",
    "operationKind": "subscription",
    "text": "subscription RenameTodoSubscription(\n  $input: RenameTodoSubscriptionInput!\n) {\n  renameTodo(input: $input) {\n    todo {\n      id\n      text\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c016ac6e5a0932db829873bff87b0637';
export default node;
