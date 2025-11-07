export function formatPhoneNumber(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove all non-numeric characters
  const countryCode = '+7';
  const areaCode = cleanedPhoneNumber.slice(1, 4);
  const firstPart = cleanedPhoneNumber.slice(4, 7);
  const secondPart = cleanedPhoneNumber.slice(7, 9);
  const thirdPart = cleanedPhoneNumber.slice(9, 11);
  return `${countryCode} (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
}
