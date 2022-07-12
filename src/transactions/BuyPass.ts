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

import { PassBookProgram } from '../PassBookProgram';
import { PayoutInfoArgs } from './InitPassBook';

type Args = {
  marketFeeBasisPoint: number;
  referralShare: number;
  referralKickBackShare: number;
};

export class BuyPassArgs extends Borsh.Data<Args> {
  static readonly SCHEMA = BuyPassArgs.struct([
    ['instruction', 'u8'],
    ['marketFeeBasisPoint', 'u16'],
    ['referralShare', 'u8'],
    ['referralKickBackShare', 'u8'],
  ]);

  instruction = 5;
  marketFeeBasisPoint: number;
  referralShare: number;
  referralKickBackShare: number;
}

export type BuyPassParams = {
  buyer: PublicKey;
  store: PublicKey;
  passBook: PublicKey;
  buyerTokenAccount: PublicKey;
  tradeHistory: PublicKey;
  membership: PublicKey;
  marketFeeBasisPoint: number;
  referralShare: number;
  referralKickBackShare: number;
  marketPayout: PayoutInfoArgs | null;
  referrerPayout: PayoutInfoArgs | null;
  creatorPayout: PayoutInfoArgs;
};

export class BuyPass extends Transaction {
  constructor(options: TransactionCtorFields, params: BuyPassParams) {
    super(options);
    const { feePayer } = options;
    const {
      buyer,
      store,
      passBook,
      buyerTokenAccount,
      marketFeeBasisPoint,
      referralShare,
      referralKickBackShare,
      tradeHistory,
      membership,
      marketPayout,
      referrerPayout,
      creatorPayout,
    } = params;
    const data = BuyPassArgs.serialize({
      marketFeeBasisPoint,
      referralShare,
      referralKickBackShare,
    });

    const keys = [
      {
        pubkey: passBook,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: store,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: buyer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: buyerTokenAccount,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: feePayer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: tradeHistory,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: membership,
        isSigner: false,
        isWritable: true,
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
    keys.push({
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    });
    this.add(
      new TransactionInstruction({
        keys,
        programId: PassBookProgram.PUBKEY,
        data,
      }),
    );
  }
}