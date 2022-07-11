import {
  Borsh,
  StringPublicKey,
  AnyPublicKey,
  ERROR_INVALID_OWNER,
  Account,
} from '@metaplex-foundation/mpl-core';
import bs58 from 'bs58';
import BN from 'bn.js';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { AccountKey } from './constants';
import { PassBookProgram } from '../PassBookProgram';

export const MAX_TRADE_HISTORY_DATA_LEN = 73;

export type TradeHistoryDataArgs = {
  key: AccountKey;
  passbook: StringPublicKey;
  wallet: StringPublicKey;
  alreadyBought: BN;
};

export class TradeHistoryData extends Borsh.Data<TradeHistoryDataArgs> {
  static readonly SCHEMA = TradeHistoryData.struct([
    ['key', 'u8'],
    ['passbook', 'pubkeyAsString'],
    ['wallet', 'pubkeyAsString'],
    ['alreadyBought', 'u64'],
  ]);
  key: AccountKey;
  passbook: StringPublicKey;
  wallet: StringPublicKey;
  alreadyBought: BN;

  constructor(args: TradeHistoryDataArgs) {
    super(args);
    this.key = AccountKey.TradeHistory;
  }
}

export class TradeHistory extends Account<TradeHistoryData> {
  static readonly PREFIX = 'history';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = TradeHistoryData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(passbook: AnyPublicKey, wallet: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(passbook).toBuffer(),
      new PublicKey(wallet).toBuffer(),
      Buffer.from(TradeHistory.PREFIX),
    ]);
  }

  static async findMany(
    connection: Connection,
    filters: {
      passbook?: AnyPublicKey;
      wallet?: AnyPublicKey;
    } = {},
  ) {
    const baseFilters = [
      // Filter for PassBook by key
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.from([AccountKey.PassBook])),
        },
      },
      // Filter for assigned to authority
      filters.passbook && {
        memcmp: {
          offset: 1,
          bytes: new PublicKey(filters.passbook).toBase58(),
        },
      },
      // Filter for assigned to mint
      filters.wallet && {
        memcmp: {
          offset: 33,
          bytes: new PublicKey(filters.wallet).toBase58(),
        },
      },
    ].filter(Boolean);

    return (await PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map(
      (account) => TradeHistory.from(account),
    );
  }
}
