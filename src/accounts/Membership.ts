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
import { AccountKey, MembershipState } from './constants';
import { PassBookProgram } from '../PassBookProgram';
import { Uses } from './Uses';

export const MAX_MEMBERSHIP_DATA_LEN = 192;

export type MembershipDataArgs = {
  key: AccountKey;
  store: StringPublicKey;
  state: MembershipState;
  owner: StringPublicKey;
  passbook: StringPublicKey | null;
  pass: StringPublicKey | null;
  expiresAt: BN | null;
  activatedAt: BN | null;
  uses: Uses | null;
};

export class MembershipData extends Borsh.Data<MembershipDataArgs> {
  static readonly SCHEMA = new Map([
    ...Uses.SCHEMA,
    ...MembershipData.struct([
      ['key', 'u8'],
      ['store', 'pubkeyAsString'],
      ['state', 'u8'],
      ['owner', 'pubkeyAsString'],
      ['passbook', { kind: 'option', type: 'pubkeyAsString' }],
      ['pass', { kind: 'option', type: 'pubkeyAsString' }],
      ['expiresAt', { kind: 'option', type: 'u64' }],
      ['activatedAt', { kind: 'option', type: 'u64' }],
      ['uses', { kind: 'option', type: Uses }],
    ]),
  ]);
  key: AccountKey;
  store: StringPublicKey;
  state: MembershipState;
  owner: StringPublicKey;
  passbook: StringPublicKey | null;
  pass: StringPublicKey | null;
  expiresAt: BN | null;
  activatedAt: BN | null;
  uses: Uses | null;

  constructor(args: MembershipDataArgs) {
    super(args);
    this.key = AccountKey.Membership;
  }
}

export class Membership extends Account<MembershipData> {
  static readonly PREFIX = 'membership';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = MembershipData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(store: AnyPublicKey, wallet: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(store).toBuffer(),
      new PublicKey(wallet).toBuffer(),
      Buffer.from(Membership.PREFIX),
    ]);
  }

  static async findMany(
    connection: Connection,
    filters: {
      store?: AnyPublicKey;
      state?: MembershipState;
      owner?: AnyPublicKey;
    } = {},
  ) {
    const baseFilters = [
      // Filter for Membership by key
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(Buffer.from([AccountKey.Membership])),
        },
      },
      // Filter for assigned to store
      filters.store && {
        memcmp: {
          offset: 1,
          bytes: new PublicKey(filters.store).toBase58(),
        },
      },
      // Filter for state
      filters.state && {
        memcmp: {
          offset: 33,
          bytes: bs58.encode(Buffer.from([filters.state])),
        },
      },
      // Filter for assigned to store
      filters.owner && {
        memcmp: {
          offset: 34,
          bytes: new PublicKey(filters.owner).toBase58(),
        },
      },
    ].filter(Boolean);

    return (await PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map(
      (account) => Membership.from(account),
    );
  }

  static async findByStore(
    connection: Connection,
    store: AnyPublicKey,
  ): Promise<Account<Membership>[]> {
    return await Membership.findMany(connection, {
      store,
    });
  }
}
