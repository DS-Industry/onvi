import {ICard} from './Card';

export interface DeviceMeta {
  deviceId: string;
  model: string;
  name: string;
  platform: string;
  platformVersion: string;
  manufacturer: string;
}

export interface Meta {
  metaId?: number;
  clientId: number;
  deviceId: string;
  model: string;
  name: string;
  platform: string;
  platformVersion: string;
  manufacturer: string;
  appToken: string;
}

export interface IUser {
  id: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  cards: ICard | null;
  avatar: string | null;
  balance: number | null;
  tariff: number | null;
  isNotifications: number | null;
  meta: Meta | null;
}

export interface IUserPartial {
  id?: number | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  birthday?: string | null;
  cards?: ICard | null;
  avatar?: string | null;
  balance?: number | null;
  tariff?: number | null;
}
