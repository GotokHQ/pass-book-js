import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import { TOKEN_METADATA_PROGRAM_ID } from '../accounts';
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
    ['duration', { kind: 'option', type: 'u64' }],
    ['maxSupply', { kind: 'option', type: 'u64' }],
    ['blurHash', { kind: 'option', type: 'string' }],
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
  duration: BN | null;
  maxSupply: BN | null;
  blurHash: string | null;
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
  price: BN;
  priceMint: PublicKey;
  referralEndDate: BN | null;
  marketPayout: PayoutInfoArgs | null;
  referrerPayout: PayoutInfoArgs | null;
  creatorsPayout: PayoutInfoArgs[];
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
      price,
      priceMint,
      referralEndDate,
      marketPayout,
      referrerPayout,
      creatorsPayout,
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
      price,
      hasReferrer: !!referrerPayout,
      hasMarketAuthority: !!marketPayout,
      referralEndDate,
    });

    const keys = [
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
        isWritable: true,
      },
      {
        pubkey: masterEdition,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: priceMint,
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
    ];

    creatorsPayout.forEach((payout) => {
      keys.push({
        pubkey: payout.payoutAccount,
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: payout.tokenAccount,
        isSigner: false,
        isWritable: true,
      });
    });

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
    keys.push(
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    );
    this.add(
      new TransactionInstruction({
        keys,
        programId: PassBookProgram.PUBKEY,
        data,
      }),
    );
  }
}
