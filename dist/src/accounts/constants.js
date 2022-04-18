"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassState = exports.AccountKey = void 0;
var AccountKey;
(function (AccountKey) {
    AccountKey[AccountKey["Uninitialized"] = 0] = "Uninitialized";
    AccountKey[AccountKey["Pass"] = 1] = "Pass";
    AccountKey[AccountKey["PassStore"] = 2] = "PassStore";
    AccountKey[AccountKey["PassBook"] = 3] = "PassBook";
})(AccountKey = exports.AccountKey || (exports.AccountKey = {}));
var PassState;
(function (PassState) {
    PassState[PassState["NotActivated"] = 0] = "NotActivated";
    PassState[PassState["Activated"] = 1] = "Activated";
    PassState[PassState["Deactivated"] = 2] = "Deactivated";
    PassState[PassState["Ended"] = 3] = "Ended";
})(PassState = exports.PassState || (exports.PassState = {}));
//# sourceMappingURL=constants.js.map