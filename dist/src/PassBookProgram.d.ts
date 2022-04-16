import { PublicKey } from '@solana/web3.js';
import { Program } from '@metaplex-foundation/mpl-core';
export declare class PassBookProgram extends Program {
    static readonly PREFIX = "passbook";
    static readonly PUBKEY: PublicKey;
    static findProgramAuthority(): Promise<[PublicKey, number]>;
    static findPassStoreAccount(authority: PublicKey): Promise<[PublicKey, number]>;
    static findPassBookAccount(mint: PublicKey): Promise<[PublicKey, number]>;
    static findPassAccount(mint: PublicKey): Promise<[PublicKey, number]>;
}
