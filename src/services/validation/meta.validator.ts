import {Meta} from '../../types/models/User.ts';

export const hasMetaDataChanged = (
  localMeta: Meta,
  remoteMeta: Meta,
): boolean => {
  return (
    localMeta.deviceId !== remoteMeta.deviceId ||
    localMeta.model !== remoteMeta.model ||
    localMeta.name !== remoteMeta.name ||
    localMeta.platform !== remoteMeta.platform ||
    localMeta.platformVersion !== remoteMeta.platformVersion ||
    localMeta.manufacturer !== remoteMeta.manufacturer ||
    localMeta.appToken !== remoteMeta.appToken
  );
};
