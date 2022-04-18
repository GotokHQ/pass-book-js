"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitPassBook = exports.InitPassBookArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const PassBookProgram_1 = require("../PassBookProgram");
class InitPassBookArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 0;
    }
}
exports.InitPassBookArgs = InitPassBookArgs;
InitPassBookArgs.SCHEMA = InitPassBookArgs.struct([
    ['instruction', 'u8'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['access', { kind: 'option', type: 'u64' }],
    ['duration', { kind: 'option', type: 'u64' }],
    ['maxSupply', { kind: 'option', type: 'u64' }],
]);
class InitPassBook extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { name, description, uri, mutable, passBook, source, store, authority, masterMetadata, masterEdition, mint, access, duration, tokenAccount, maxSupply, } = params;
        const data = InitPassBookArgs.serialize({
            name,
            description,
            uri,
            mutable,
            access,
            duration,
            maxSupply,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: passBook,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: source,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: tokenAccount,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: store,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: authority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: mint,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: masterMetadata,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: masterEdition,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: PassBookProgram_1.PassBookProgram.PUBKEY,
            data,
        }));
    }
}
exports.InitPassBook = InitPassBook;
//# sourceMappingURL=InitPassBook.js.map