/// <reference types="node" />
import { Borsh, StringPublicKey, AnyPublicKey, Account } from '@metaplex-foundation/mpl-core';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { AccountKey, PassState, DurationType } from './constants';
declare type Args = {
    key: AccountKey;
    mint: StringPublicKey;
    authority: StringPublicKey;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    passType: DurationType;
    duration: number | null;
    passState: PassState;
};
export declare class PassData extends Borsh.Data<Args> {
    static readonly SCHEMA: any;
    key: AccountKey;
    mint: StringPublicKey;
    authority: StringPublicKey;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    passType: DurationType;
    validityPeriod?: number;
    collectionMint?: StringPublicKey;
    timeValidationAuthority?: StringPublicKey;
    passState: PassState;
    constructor(args: Args);
}
export declare class Pass extends Account<PassData> {
    static readonly PASS_PREFIX = "store";
    constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>);
    static getPDA(mint: AnyPublicKey): Promise<PublicKey>;
    static findMany(connection: Connection, filters?: {
        mint?: AnyPublicKey;
        authority?: AnyPublicKey;
    }): Promise<Account<Pass>[]>;
    static findByMint(connection: Connection, mint: AnyPublicKey): Promise<Pass>;
    static findInfoByOwner(connection: Connection, owner: AnyPublicKey): Promise<Map<AnyPublicKey, AccountInfo<Buffer>>>;
    static findPassDataByOwner(connection: Connection, owner: AnyPublicKey): Promise<PassData[]>;
}
export {};
