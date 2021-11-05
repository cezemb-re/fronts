import { GeoLocation } from './geoLocation';

type GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

export default interface Place {
  value?: string;
  google_id?: string;
  types?: string[];
  is_address?: boolean;
  geo_location?: GeoLocation;
  address_components?: GeocoderAddressComponent;
  locality?: string;
  neighborhood?: string;
  name?: string;
}
