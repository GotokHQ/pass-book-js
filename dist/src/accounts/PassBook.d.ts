/// <reference types="node" />
import { Borsh, StringPublicKey, AnyPublicKey, Account } from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { AccountKey, PassState, DurationType } from './constants';
export declare type PassBookDataArgs = {
    key: AccountKey;
    mint: StringPublicKey;
    authority: StringPublicKey;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    durationType: DurationType;
    duration: BN;
    totalPasses: BN;
    maxSupply: BN | null;
};
export declare class PassBookData extends Borsh.Data<PassBookDataArgs> {
    static readonly SCHEMA: any;
    key: AccountKey;
    mint: StringPublicKey;
    authority: StringPublicKey;
    name: string;
    description: string;
    uri: string;
    mutable: boolean;
    passState: PassState;
    durationType: DurationType;
    duration: BN;
    totalPasses: BN;
    maxSupply: BN | null;
    constructor(args: PassBookDataArgs);
}
export declare class PassBook extends Account<PassBookData> {
    constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>);
    static getPDA(mint: AnyPublicKey): Promise<PublicKey>;
    static findMany(connection: Connection, filters?: {
        mint?: AnyPublicKey;
        authority?: AnyPublicKey;
    }): Promise<Account<PassBook>[]>;
    static findByMint(connection: Connection, mint: AnyPublicKey): Promise<PassBook>;
    static findByAuthority(connection: Connection, authority: AnyPublicKey): Promise<Account<PassBook>[]>;
}
