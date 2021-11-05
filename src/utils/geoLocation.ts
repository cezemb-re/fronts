export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export function serializeGeoLocation(geoLocation: GeoLocation): string {
  return `${geoLocation.latitude},${geoLocation.longitude}`;
}

export function parseGeoLocation(geoLocation: string): GeoLocation | undefined {
  if (!geoLocation || !geoLocation.length) {
    return undefined;
  }
  const parts = geoLocation.split(',');
  if (parts.length !== 2) {
    return undefined;
  }
  const [latitude, longitude] = parts.map(parseFloat);

  return { latitude, longitude };
}
