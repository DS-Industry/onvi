const isValidStorageData = (accessToken: string, expiredDate: string) => {
  return accessToken && expiredDate && expiredDate > new Date().toISOString();
};

const hasAccessTokenCredentials = (refreshToken: string | null) => {
  return refreshToken;
};

export {isValidStorageData, hasAccessTokenCredentials};
