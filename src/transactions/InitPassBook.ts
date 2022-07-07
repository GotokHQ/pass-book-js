import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
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
  maxUses: BN | null;
  maxSupply: BN | null;
  price: BN;
  hasReferrer: boolean;
  hasMarketAuthority: boolean;
  referralEndDate: BN | null;
};

export class InitPassBookArgs extends Borsh.Data<Args> {
  static readonly SCHEMA = InitPassBookArgs.struct([
    ['instruction', 'u8'],
    ['name', 'string'],
    ['description', 'string'],
    ['uri', 'string'],
    ['mutable', 'u8'],
    ['access', { kind: 'option', type: 'u64' }],
    ['maxUses', { kind: 'option', type: 'u64' }],
    ['maxSupply', { kind: 'option', type: 'u64' }],
    ['price', 'u64'],
    ['hasReferrer', 'u8'],
    ['hasMarketAuthority', 'u8'],
    ['referralEndDate', { kind: 'option', type: 'u64' }],
  ]);

  instruction = 4;
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  access: BN | null;
  maxUses: BN | null;
  maxSupply: BN | null;
  price: BN;
  hasReferrer: boolean;
  hasMarketAuthority: boolean;
  referralEndDate: BN | null;
}

export type PayoutInfoArgs = {
  authority: PublicKey;
  payoutAccount: PublicKey;
  tokenAccount: PublicKey;
};

export type InitPassBookParams = {
  name: string;
  description: string;
  uri: string;
  mutable: boolean;
  authority: PublicKey;
  store: PublicKey;
  passBook: PublicKey;
  mint: PublicKey;
  maxUses: BN | null;
  access: BN | null;
  maxSupply: BN | null;
  price: BN;
  referralEndDate: BN | null;
  marketPayout: PayoutInfoArgs | null;
  referrerPayout: PayoutInfoArgs | null;
  creatorPayout: PayoutInfoArgs;
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
      store,
      authority,
      mint,
      access,
      maxUses,
      maxSupply,
      price,
      referralEndDate,
      marketPayout,
      referrerPayout,
      creatorPayout,
    } = params;
    const data = InitPassBookArgs.serialize({
      name,
      description,
      uri,
      mutable,
      access,
      maxUses,
      maxSupply,
      price,
      hasReferrer: !!referrerPayout,
      hasMarketAuthority: !!marketPayout,
      referralEndDate,
    });

    const keys = [
      {
        pubkey: passBook,
        isSigner: true,
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
        pubkey: SYSVAR_CLOCK_PUBKEY,
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
        pubkey: creatorPayout.payoutAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: creatorPayout.tokenAccount,
        isSigner: false,
        isWritable: true,
      },
    ];

    if (marketPayout) {
      keys.push({
        pubkey: marketPayout.authority,
        isSigner: true,
        isWritable: false,
      });
      keys.push({
        pubkey: marketPayout.payoutAccount,
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: marketPayout.tokenAccount,
        isSigner: false,
        isWritable: true,
      });
    }

    if (referrerPayout) {
      keys.push({
        pubkey: referrerPayout.authority,
        isSigner: false,
        isWritable: false,
      });
      keys.push({
        pubkey: referrerPayout.payoutAccount,
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: referrerPayout.tokenAccount,
        isSigner: false,
        isWritable: true,
      });
    }
    this.add(
      new TransactionInstruction({
        keys,
        programId: PassBookProgram.PUBKEY,
        data,
      }),
    );
  }
}
