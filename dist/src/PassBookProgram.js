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
exports.PassBookProgram = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const accounts_1 = require("./accounts");
class PassBookProgram extends mpl_core_1.Program {
    static findProgramAuthority() {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([Buffer.from(PassBookProgram.PREFIX, 'utf8'), PassBookProgram.PUBKEY.toBuffer()], PassBookProgram.PUBKEY);
        });
    }
    static findPassStoreAccount(authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(PassBookProgram.PREFIX, 'utf8'),
                PassBookProgram.PUBKEY.toBuffer(),
                authority.toBuffer(),
                Buffer.from(accounts_1.Store.STORE_PREFIX, 'utf8'),
            ], PassBookProgram.PUBKEY);
        });
    }
    static findPassBookAccount(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(PassBookProgram.PREFIX, 'utf8'),
                PassBookProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
            ], PassBookProgram.PUBKEY);
        });
    }
    static findPassAccount(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(PassBookProgram.PREFIX, 'utf8'),
                PassBookProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
            ], PassBookProgram.PUBKEY);
        });
    }
}
exports.PassBookProgram = PassBookProgram;
PassBookProgram.PREFIX = 'passbook';
PassBookProgram.PUBKEY = new web3_js_1.PublicKey('passjvPvHQWN4SvBCmHk1gdrtBvoHRERtQK9MKemreQ');
//# sourceMappingURL=PassBookProgram.js.map