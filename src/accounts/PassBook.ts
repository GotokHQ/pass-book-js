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
import { AccountKey, PassState } from './constants';
import { PassBookProgram } from '../PassBookProgram';

export type PassBookDataArgs = {
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  name: string;
  description: string;
  uri: string;
  mutable: number;
  access: BN | null;
  duration: BN | null;
  totalPasses: BN;
  maxSupply: BN | null;
  blurHash: string | null;
  createdAt: BN;
  price: BN;
  priceMint: StringPublicKey;
  token: StringPublicKey;
  gateKeeper: StringPublicKey | null;
};

export class PassBookData extends Borsh.Data<PassBookDataArgs> {
  static readonly SCHEMA = PassBookData.struct([
    ['key', 'u8'],
    ['authority', 'pubkeyAsString'],
    ['mint', 'pubkeyAsString'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['passState', 'u8'],
    ['access', { kind: 'option', type: 'u64' }],
    ['duration', { kind: 'option', type: 'u64' }],
    ['totalPasses', 'u64'],
    ['maxSupply', { kind: 'option', type: 'u64' }],
    ['blurHash', { kind: 'option', type: 'string' }],
    ['createdAt', 'u64'],
    ['price', 'u64'],
    ['priceMint', 'pubkeyAsString'],
    ['token', 'pubkeyAsString'],
    ['gateKeeper', { kind: 'option', type: 'pubkeyAsString' }],
  ]);
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  passState: PassState;
  access: BN | null;
  duration: BN | null;
  totalPasses: BN;
  maxSupply: BN | null;
  blurHash: string | null;
  createdAt: BN;
  price: BN;
  priceMint: StringPublicKey;
  token: StringPublicKey;
  gateKeeper: StringPublicKey | null;

  constructor(args: PassBookDataArgs) {
    super(args);
    const REPLACE = new RegExp('\u0000', 'g');
    this.key = AccountKey.PassBook;
    this.name = args.name.replace(REPLACE, '');
    this.description = args.description.replace(REPLACE, '');
    this.uri = args.uri.replace(REPLACE, '');
    this.blurHash = args.blurHash?.replace(REPLACE, '');
    this.mutable = args.mutable == 1;
  }
}

export class PassBook extends Account<PassBookData> {
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = PassBookData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(mint: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(mint).toBuffer(),
    ]);
  }

  static async findMany(
    connection: Connection,
    filters: {
      mint?: AnyPublicKey;
      authority?: AnyPublicKey;
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
      filters.authority && {
        memcmp: {
          offset: 1,
          bytes: new PublicKey(filters.authority).toBase58(),
        },
      },
      // Filter for assigned to mint
      filters.mint && {
        memcmp: {
          offset: 33,
          bytes: new PublicKey(filters.mint).toBase58(),
        },
      },
    ].filter(Boolean);

    return (await PassBookProgram.getProgramAccounts(connection, { filters: baseFilters })).map(
      (account) => PassBook.from(account),
    );
  }

  static async findByMint(connection: Connection, mint: AnyPublicKey): Promise<PassBook> {
    const pda = await PassBook.getPDA(mint);
    return PassBook.load(connection, pda);
  }

  static async findByAuthority(
    connection: Connection,
    authority: AnyPublicKey,
  ): Promise<Account<PassBook>[]> {
    return await PassBook.findMany(connection, {
      authority,
    });
  }
}
