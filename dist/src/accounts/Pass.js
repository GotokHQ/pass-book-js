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
exports.Pass = exports.PassData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const PassBookProgram_1 = require("../PassBookProgram");
const constants_1 = require("./constants");
class PassData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        const REPLACE = new RegExp('\u0000', 'g');
        this.key = constants_1.AccountKey.PassBook;
        this.name = args.name.replace(REPLACE, '');
        this.description = args.description.replace(REPLACE, '');
        this.uri = args.uri.replace(REPLACE, '');
    }
}
exports.PassData = PassData;
PassData.SCHEMA = PassData.struct([
    ['key', 'u8'],
    ['mint', 'pubkeyAsString'],
    ['authority', 'pubkeyAsString'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['passType', 'u8'],
    ['access', { kind: 'option', type: 'u32' }],
    ['passState', 'u8'],
]);
class Pass extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        this.data = PassData.deserialize(this.info.data);
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
                Buffer.from(Pass.PASS_PREFIX),
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
            return (yield PassBookProgram_1.PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map((account) => Pass.from(account));
        });
    }
    static findByMint(connection, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = yield Pass.getPDA(mint);
            return Pass.load(connection, pda);
        });
    }
    static findInfoByOwner(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield mpl_core_1.TokenAccount.getTokenAccountsByOwner(connection, owner);
            const metadataPdaLookups = accounts.reduce((memo, { data }) => {
                var _a;
                return ((_a = data.amount) === null || _a === void 0 ? void 0 : _a.eq(new bn_js_1.default(1))) ? [...memo, Pass.getPDA(data.mint)] : memo;
            }, []);
            const metadataAddresses = yield Promise.all(metadataPdaLookups);
            return mpl_core_1.Account.getInfos(connection, metadataAddresses);
        });
    }
    static findPassDataByOwner(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield Pass.findInfoByOwner(connection, owner);
            return Array.from(tokenInfo.values()).map((m) => PassData.deserialize(m.data));
        });
    }
}
exports.Pass = Pass;
Pass.PASS_PREFIX = 'store';
//# sourceMappingURL=Pass.js.map