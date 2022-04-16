"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.StoreData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const PassBookProgram_1 = require("../PassBookProgram");
class StoreData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = constants_1.AccountKey.PassStore;
    }
}
exports.StoreData = StoreData;
StoreData.SCHEMA = StoreData.struct([
    ['key', 'u8'],
    ['authority', 'pubkeyAsString'],
    ['redemptionsCount', 'u64'],
    ['passCount', 'u64'],
    ['passBookCount', 'u64'],
]);
class Store extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(PassBookProgram_1.PassBookProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        this.data = StoreData.deserialize(this.info.data);
    }
    static getPDA(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return PassBookProgram_1.PassBookProgram.findProgramAddress([
                Buffer.from(PassBookProgram_1.PassBookProgram.PREFIX),
                PassBookProgram_1.PassBookProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(authority).toBuffer(),
                Buffer.from(Store.STORE_PREFIX),
            ]);
        });
    }
}
exports.Store = Store;
Store.STORE_PREFIX = 'store';
//# sourceMappingURL=Store.js.map