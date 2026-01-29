import { BayTypeEnum } from "@app-types/BayTypeEnum";

export enum DeviceStatus {
  BUSY = 'Busy',
  FREE = 'Free',
  UNAVAILABLE = 'Unavailable'
}

export interface IPingPosResponse {
  id: number;
  status: DeviceStatus;
  type: BayTypeEnum;
  errorMessage: string | null;
}
