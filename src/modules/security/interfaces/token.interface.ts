export type AccessToken = string;
export type RefreshToken = string;
export type ResetToken = string;

export interface Tokens {
  access_token: AccessToken;
  refresh_token: RefreshToken;
}
