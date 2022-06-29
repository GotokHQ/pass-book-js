import {
  Borsh,
  StringPublicKey,
  AnyPublicKey,
  ERROR_INVALID_OWNER,
  Account,
} from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { PassBookProgram } from '../PassBookProgram';
import { AccountKey } from './constants';

export const MAX_PAYOUT_DATA_LEN = 117;

export type PayoutDataArgs = {
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  treasuryHolder: StringPublicKey;
  cashIn: BN;
  cashOut: BN;
};

export class PayoutData extends Borsh.Data<PayoutDataArgs> {
  static readonly SCHEMA = PayoutData.struct([
    ['key', 'u8'],
    ['authority', 'pubkeyAsString'],
    ['mint', 'pubkeyAsString'],
    ['treasuryHolder', 'pubkeyAsString'],
    ['cashIn', 'u64'],
    ['cashOut', 'u64'],
  ]);
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  treasuryHolder: StringPublicKey;
  cashIn: BN;
  cashOut: BN;

  constructor(args: PayoutDataArgs) {
    super(args);
    this.key = AccountKey.Payout;
  }
}

export class Payout extends Account<PayoutData> {
  static readonly PREFIX = 'payout';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = PayoutData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(authority: AnyPublicKey, mint: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(authority).toBuffer(),
      new PublicKey(mint).toBuffer(),
      Buffer.from(Payout.PREFIX),
    ]);
  }
}
