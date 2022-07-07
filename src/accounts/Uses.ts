import {
  Account,
  AnyPublicKey,
  Borsh,
  ERROR_INVALID_OWNER,
  StringPublicKey,
} from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import bs58 from 'bs58';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { AccountKey } from './constants';
import { PassBookProgram } from '../PassBookProgram';

export const MAX_USE_AUTHORITY_DATA_LEN = 50;

export type UsesArgs = {
  remaining: BN;
  total: BN;
};

export class Uses extends Borsh.Data<UsesArgs> {
  static readonly SCHEMA = Uses.struct([
    ['remaining', 'u64'],
    ['total', 'u64'],
  ]);
  remaining: BN;
  total: BN;

  constructor(args: UsesArgs) {
    super(args);
  }
}

export type UseAuthorityDataArgs = {
  key: AccountKey;
  membership: StringPublicKey;
  allowedUses: BN;
  bump: number;
};

export class UseAuthorityData extends Borsh.Data<UseAuthorityDataArgs> {
  static readonly SCHEMA = new Map(
    UseAuthorityData.struct([
      ['key', 'u8'],
      ['membership', 'pubkeyAsString'],
      ['allowedUses', 'u64'],
      ['bump', 'u8'],
    ]),
  );
  key: AccountKey;
  allowedUses: BN;
  membership: StringPublicKey;
  bump: number;

  constructor(args: UseAuthorityDataArgs) {
    super(args);
    this.key = AccountKey.UseAuthority;
  }
}

export class UseAuthority extends Account<UseAuthorityData> {
  static readonly PREFIX = 'store';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = UseAuthorityData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(membership: AnyPublicKey, user: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(membership).toBuffer(),
      new PublicKey(user).toBuffer(),
      Buffer.from(UseAuthority.PREFIX),
    ]);
  }

  static async findMany(
    connection: Connection,
    filters: {
      membership?: AnyPublicKey;
    } = {},
  ) {
    const baseFilters = [
      // Filter for UseAuthority by key
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.from([AccountKey.UseAuthority])),
        },
      },
      // Filter for assigned to store
      filters.membership && {
        memcmp: {
          offset: 1,
          bytes: new PublicKey(filters.membership).toBase58(),
        },
      },
    ].filter(Boolean);

    return (await PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map(
      (account) => UseAuthority.from(account),
    );
  }

  static async findByStore(
    connection: Connection,
    membership: AnyPublicKey,
  ): Promise<Account<UseAuthority>[]> {
    return await UseAuthority.findMany(connection, {
      membership,
    });
  }
}
