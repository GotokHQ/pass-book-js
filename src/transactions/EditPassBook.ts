import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { PassBookProgram } from '../PassBookProgram';

type Args = {
  name?: string;
  description?: string;
  uri?: string;
  mutable?: boolean;
  price: BN | null;
};

export class EditPassBookArgs extends Borsh.Data<Args> {
  static readonly SCHEMA = EditPassBookArgs.struct([
    ['instruction', 'u8'],
    ['name', { kind: 'option', type: 'string' }],
    ['description', { kind: 'option', type: 'string' }],
    ['uri', { kind: 'option', type: 'string' }],
    ['price', { kind: 'option', type: 'u64' }],
    ['mutable', { kind: 'option', type: 'u8' }],
  ]);

  instruction = 3;
  name?: string;
  description?: string;
  uri?: string;
  mutable?: boolean;
  price: BN | null;
}

export type EditPassBookParams = {
  name?: string;
  description?: string;
  uri?: string;
  price: BN | null;
  mutable?: boolean;
  priceMint?: PublicKey;
  passBook: PublicKey;
  authority: PublicKey;
};

export class EditPassBook extends Transaction {
  constructor(options: TransactionCtorFields, params: EditPassBookParams) {
    super(options);
    const { name, description, uri, mutable, price, priceMint, passBook, authority } = params;
    const data = EditPassBookArgs.serialize({
      name,
      description,
      uri,
      mutable,
      price,
    });
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
    if (priceMint) {
      keys.push({
        pubkey: priceMint,
        isSigner: false,
        isWritable: false,
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
