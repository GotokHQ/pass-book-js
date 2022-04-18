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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassBook = exports.PassBookData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const PassBookProgram_1 = require("../PassBookProgram");
const constants_1 = require("./constants");
class PassBookData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        const REPLACE = new RegExp('\u0000', 'g');
        this.key = constants_1.AccountKey.PassBook;
        this.name = args.name.replace(REPLACE, '');
        this.description = args.description.replace(REPLACE, '');
        this.uri = args.uri.replace(REPLACE, '');
    }
}
exports.PassBookData = PassBookData;
PassBookData.SCHEMA = PassBookData.struct([
    ['key', 'u8'],
    ['authority', 'pubkeyAsString'],
    ['mint', 'pubkeyAsString'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['passState', 'u8'],
    ['access', { kind: 'option', type: 'u64' }],
    ['duration', { kind: 'option', type: 'u64' }],
    ['totalPasses', 'u64'],
    ['maxSupply', { kind: 'option', type: 'u64' }],
]);
class PassBook extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        this.data = PassBookData.deserialize(this.info.data);
        if (!this.assertOwner(PassBookProgram_1.PassBookProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
    }
    static getPDA(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return PassBookProgram_1.PassBookProgram.findProgramAddress([
                Buffer.from(PassBookProgram_1.PassBookProgram.PREFIX),
                PassBookProgram_1.PassBookProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(mint).toBuffer(),
            ]);
        });
    }
    static findMany(connection, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseFilters = [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58_1.default.encode(Buffer.from([constants_1.AccountKey.PassBook])),
                    },
                },
                filters.authority && {
                    memcmp: {
                        offset: 1,
                        bytes: new web3_js_1.PublicKey(filters.authority).toBase58(),
                    },
                },
                filters.mint && {
                    memcmp: {
                        offset: 33,
                        bytes: new web3_js_1.PublicKey(filters.mint).toBase58(),
                    },
                },
            ].filter(Boolean);
            return (yield PassBookProgram_1.PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map((account) => PassBook.from(account));
        });
    }
    static findByMint(connection, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = yield PassBook.getPDA(mint);
            return PassBook.load(connection, pda);
        });
    }
    static findByAuthority(connection, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PassBook.findMany(connection, {
                authority,
            });
        });
    }
}
exports.PassBook = PassBook;
//# sourceMappingURL=PassBook.js.map