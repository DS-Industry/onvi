export interface IUpdateUserMetaRequest {
  metaId?: number;
  clientId?: number;
  deviceId?: string;
  model?: string;
  name?: string;
  platform?: string;
  platformVersion?: string;
  manufacturer?: string;
  appToken?: string;
}
