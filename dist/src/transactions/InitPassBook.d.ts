import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
import { DurationType } from '../accounts/constants';
declare type Args = {
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    durationType: DurationType;
    duration: BN;
    maxSupply: BN | null;
};
export declare class InitPassBookArgs extends Borsh.Data<Args> {
    static readonly SCHEMA: any;
    instruction: number;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    duration: BN;
    durationType: DurationType;
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
    duration: BN;
    durationType: DurationType;
    tokenAccount: PublicKey;
    maxSupply: BN | null;
};
export declare class InitPassBook extends Transaction {
    constructor(options: TransactionCtorFields, params: InitPassBookParams);
}
export {};
