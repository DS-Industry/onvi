export interface IGazpromResponseData {
  token: string;
}

export interface IGazpromSubscriptionResponseData {
  status: string;
  start_at?: string;
  expiration_at?: string;
}
