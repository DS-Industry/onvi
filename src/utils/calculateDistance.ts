const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const calculateDistance = (
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number,
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return 0;
  }

  const earthRadius = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences between the coordinates
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadius * c;

  return distance;
};

export default calculateDistance;
