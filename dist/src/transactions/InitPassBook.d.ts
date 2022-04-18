import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
declare type Args = {
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    access: BN | null;
    duration: BN | null;
    maxSupply: BN | null;
};
export declare class InitPassBookArgs extends Borsh.Data<Args> {
    static readonly SCHEMA: any;
    instruction: number;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    access: BN | null;
    duration: BN | null;
    maxSupply: BN | null;
}
export declare type InitPassBookParams = {
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    authority: PublicKey;
    masterMetadata: PublicKey;
    masterEdition: PublicKey;
    store: PublicKey;
    source: PublicKey;
    passBook: PublicKey;
    mint: PublicKey;
    duration: BN | null;
    access: BN | null;
    tokenAccount: PublicKey;
    maxSupply: BN | null;
};
export declare class InitPassBook extends Transaction {
    constructor(options: TransactionCtorFields, params: InitPassBookParams);
}
export {};
