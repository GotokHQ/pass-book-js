import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import { PassBookProgram } from '../PassBookProgram';

type Args = {
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  access: BN | null;
  duration: BN | null;
  maxSupply: BN | null;
  blurHash: string | null;
};

export class InitPassBookArgs extends Borsh.Data<Args> {
  static readonly SCHEMA = InitPassBookArgs.struct([
    ['instruction', 'u8'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['access', { kind: 'option', type: 'u64' }],
    ['duration', { kind: 'option', type: 'u64' }],
    ['maxSupply', { kind: 'option', type: 'u64' }],
    ['blurHash', { kind: 'option', type: 'string' }],
  ]);

  instruction = 0;
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  access: BN | null;
  duration: BN | null;
  maxSupply: BN | null;
  blurHash: string | null;
}

export type InitPassBookParams = {
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  authority: PublicKey;
  masterMetadata: PublicKey;
  masterEdition: PublicKey;
  store: PublicKey;
  source: PublicKey;
  passBook: PublicKey;
  mint: PublicKey;
  duration: BN | null;
  access: BN | null;
  tokenAccount: PublicKey;
  maxSupply: BN | null;
  blurHash: string | null;
};

export class InitPassBook extends Transaction {
  constructor(options: TransactionCtorFields, params: InitPassBookParams) {
    super(options);
    const { feePayer } = options;
    const {
      name,
      description,
      uri,
      mutable,
      passBook,
      source,
      store,
      authority,
      masterMetadata,
      masterEdition,
      mint,
      access,
      duration,
      tokenAccount,
      maxSupply,
      blurHash,
    } = params;

    const data = InitPassBookArgs.serialize({
      name,
      description,
      uri,
      mutable,
      access,
      duration,
      maxSupply,
      blurHash,
    });
    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: passBook,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: source,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: tokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: store,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: authority,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: feePayer,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: mint,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: masterMetadata,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: masterEdition,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: PassBookProgram.PUBKEY,
        data,
      }),
    );
  }
}
