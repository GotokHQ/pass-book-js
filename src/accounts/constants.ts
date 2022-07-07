import { PublicKey } from '@solana/web3.js';

export enum AccountKey {
  Uninitialized = 0,
  Pass = 1,
  PassStore = 2,
  PassBook = 3,
  Payout = 4,
  TradeHistory = 5,
  Membership = 6,
  UseAuthority = 7,
  StoreAuthority = 8,
}

export enum PassState {
  NotActivated = 0,
  Activated = 1,
  Deactivated = 2,
  Ended = 3,
}

export enum PassBookState {
  NotActivated = 0,
  Activated = 1,
  Deactivated = 2,
}

export enum MembershipState {
  NotActivated = 0,
  Activated = 1,
  Expired = 2,
}

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);
