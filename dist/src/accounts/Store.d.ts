/// <reference types="node" />
import { Borsh, StringPublicKey, AnyPublicKey, Account } from '@metaplex-foundation/mpl-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { AccountKey } from './constants';
declare type Args = {
    key: AccountKey;
    authority: StringPublicKey;
    redemptionsCount: BN;
    passCount: BN;
    passBookCount: BN;
};
export declare class StoreData extends Borsh.Data<Args> {
    static readonly SCHEMA: any;
    key: AccountKey;
    mint: StringPublicKey;
    authority: StringPublicKey;
    redemptionsCount: string;
    passCount: string;
    passBookCount: string;
    constructor(args: Args);
}
export declare class Store extends Account<StoreData> {
    static readonly STORE_PREFIX = "store";
    constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>);
    static getPDA(authority: AnyPublicKey): Promise<PublicKey>;
}
export {};
