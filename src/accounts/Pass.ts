import {
  Borsh,
  StringPublicKey,
  AnyPublicKey,
  ERROR_INVALID_OWNER,
  Account,
} from '@metaplex-foundation/mpl-core';
import bs58 from 'bs58';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { PassBookProgram } from '../PassBookProgram';
import { AccountKey, PassState } from './constants';

type Args = {
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  maxUses: number | null;
  passState: PassState;
};

export class PassData extends Borsh.Data<Args> {
  static readonly SCHEMA = PassData.struct([
    ['key', 'u8'],
    ['mint', 'pubkeyAsString'],
    ['authority', 'pubkeyAsString'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['passType', 'u8'],
    ['access', { kind: 'option', type: 'u32' }],
    ['passState', 'u8'],
  ]);
  key: AccountKey;
  mint: StringPublicKey;
  authority: StringPublicKey;
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  access?: number;
  collectionMint?: StringPublicKey;
  timeValidationAuthority?: StringPublicKey;
  passState: PassState;

  constructor(args: Args) {
    super(args);
    const REPLACE = new RegExp('\u0000', 'g');
    this.key = AccountKey.PassBook;
    this.name = args.name.replace(REPLACE, '');
    this.description = args.description.replace(REPLACE, '');
    this.uri = args.uri.replace(REPLACE, '');
  }
}

export class Pass extends Account<PassData> {
  static readonly PASS_PREFIX = 'store';
  constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>) {
    super(pubkey, info);
    this.data = PassData.deserialize(this.info.data);
    if (!this.assertOwner(PassBookProgram.PUBKEY)) {
      throw ERROR_INVALID_OWNER();
    }
  }

  static async getPDA(mint: AnyPublicKey) {
    return PassBookProgram.findProgramAddress([
      Buffer.from(PassBookProgram.PREFIX),
      PassBookProgram.PUBKEY.toBuffer(),
      new PublicKey(mint).toBuffer(),
      Buffer.from(Pass.PASS_PREFIX),
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
      (account) => Pass.from(account),
    );
  }

  static async findByMint(connection: Connection, mint: AnyPublicKey): Promise<Pass> {
    const pda = await Pass.getPDA(mint);
    return Pass.load(connection, pda);
  }
}
