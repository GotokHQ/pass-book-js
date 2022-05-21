import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@solana/web3.js';
import { PassBookProgram } from '../PassBookProgram';

export class DeactivatePassBookArgs extends Borsh.Data {
  static readonly SCHEMA = DeactivatePassBookArgs.struct([['instruction', 'u8']]);
  instruction = 2;
}

export type DeactivatePassBookParams = {
  passBook: PublicKey;
  authority: PublicKey;
};

export class DeactivatePassBook extends Transaction {
  constructor(options: TransactionCtorFields, params: DeactivatePassBookParams) {
    super(options);
    const { passBook, authority } = params;
    const data = DeactivatePassBookArgs.serialize();
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
