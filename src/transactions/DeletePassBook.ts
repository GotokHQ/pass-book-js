import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@solana/web3.js';
import { PassBookProgram } from '../PassBookProgram';

export class DeletePassBookArgs extends Borsh.Data {
  static readonly SCHEMA = DeletePassBookArgs.struct([['instruction', 'u8']]);
  instruction = 1;
}

export type DeletePassBookParams = {
  passBook: PublicKey;
  authority: PublicKey;
  refunder: PublicKey;
  token: PublicKey;
  mint: PublicKey;
  masterEditionOwner?: PublicKey;
};

export class DeletePassBook extends Transaction {
  constructor(options: TransactionCtorFields, params: DeletePassBookParams) {
    super(options);
    const { passBook, authority, refunder, masterEditionOwner, token, mint } = params;
    const data = DeletePassBookArgs.serialize();
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
      {
        pubkey: refunder,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: token,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ];
    if (masterEditionOwner) {
      keys.push({
        pubkey: masterEditionOwner,
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
