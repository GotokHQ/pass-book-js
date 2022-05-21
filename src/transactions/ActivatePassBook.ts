import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@solana/web3.js';
import { PassBookProgram } from '../PassBookProgram';

export class ActivatePassBookArgs extends Borsh.Data {
  static readonly SCHEMA = ActivatePassBookArgs.struct([['instruction', 'u8']]);
  instruction = 0;
}

export type ActivatePassBookParams = {
  passBook: PublicKey;
  authority: PublicKey;
};

export class ActivatePassBook extends Transaction {
  constructor(options: TransactionCtorFields, params: ActivatePassBookParams) {
    super(options);
    const { passBook, authority } = params;
    const data = ActivatePassBookArgs.serialize();
    const keys = [
      {
        pubkey: passBook,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: authority,
        isSigner: true,
        isWritable: false,
      },
    ];
    this.add(
      new TransactionInstruction({
        keys,
        programId: PassBookProgram.PUBKEY,
        data,
      }),
    );
  }
}
