import {
  Borsh,
  StringPublicKey,
  ERROR_INVALID_OWNER,
  AnyPublicKey,
  Account,
} from '@metaplex-foundation/mpl-core';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import bs58 from 'bs58';
import { AccountKey } from './constants';
import { PassBookProgram } from '../PassBookProgram';

export const MAX_STORE_DATA_LEN = 99;
export const MAX_STORE_AUTHORITY_DATA_LEN = 50;

type Args = {
  key: AccountKey;
  authority: StringPublicKey;
  redemptionsCount: BN;
  membershipCount: BN;
  activeMembershipCount: BN;
  passCount: BN;
  passBookCount: BN;
  referrer: StringPublicKey;
  referralEndDate: BN | null;
};

export class StoreData extends Borsh.Data<Args> {
  static readonly SCHEMA = StoreData.struct([
    ['key', 'u8'],
    ['authority', 'pubkeyAsString'],
    ['redemptionsCount', 'u64'],
    ['membershipCount', 'u64'],
    ['activeMembershipCount', 'u64'],
    ['passCount', 'u64'],
    ['passBookCount', 'u64'],
    ['referrer', { kind: 'option', type: 'pubkeyAsString' }],
    ['referralEndDate', { kind: 'option', type: 'u64' }],
  ]);
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  redemptionsCount: string;
  membershipCount: string;
  activeMembershipCount: string;
  passCount: string;
  passBookCount: string;
  referrer: StringPublicKey | null;
  referralEndDate: BN | null;

  constructor(args: Args) {
    super(args);
    this.key = AccountKey.PassStore;
  }
}

export class Store extends Account<StoreData> {
  static readonly STORE_PREFIX = 'store';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
    this.data = StoreData.deserialize(this.info.data);
  }

  static async getPDA(authority: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(authority).toBuffer(),
      Buffer.from(Store.STORE_PREFIX),
    ]);
  }
}

export type StoreAuthorityDataArgs = {
  key: AccountKey;
  store: StringPublicKey;
  allowedUses: BN;
  bump: number;
};

export class StoreAuthorityData extends Borsh.Data<StoreAuthorityDataArgs> {
  static readonly SCHEMA = new Map(
    StoreAuthorityData.struct([
      ['key', 'u8'],
      ['store', 'pubkeyAsString'],
      ['allowedUses', 'u64'],
      ['bump', 'u8'],
    ]),
  );
  key: AccountKey;
  allowedUses: BN;
  store: StringPublicKey;
  bump: number;

  constructor(args: StoreAuthorityDataArgs) {
    super(args);
    this.key = AccountKey.StoreAuthority;
  }
}

export class StoreAuthority extends Account<StoreAuthorityData> {
  static readonly PREFIX = 'admin';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = StoreAuthorityData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(store: AnyPublicKey, user: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(store).toBuffer(),
      new PublicKey(user).toBuffer(),
      Buffer.from(StoreAuthority.PREFIX),
    ]);
  }

  static async findMany(
    connection: Connection,
    filters: {
      store?: AnyPublicKey;
    } = {},
  ) {
    const baseFilters = [
      // Filter for StoreAuthority by key
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.from([AccountKey.StoreAuthority])),
        },
      },
      // Filter for assigned to store
      filters.store && {
        memcmp: {
          offset: 1,
          bytes: new PublicKey(filters.store).toBase58(),
        },
      },
    ].filter(Boolean);

    return (await PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map(
      (account) => StoreAuthority.from(account),
    );
  }

  static async findByStore(
    connection: Connection,
    store: AnyPublicKey,
  ): Promise<Account<StoreAuthority>[]> {
    return await StoreAuthority.findMany(connection, {
      store,
    });
  }
}
