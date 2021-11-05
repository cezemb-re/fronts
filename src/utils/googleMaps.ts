import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import useScript, { ScriptStatus } from './script';

type AutocompleteService = google.maps.places.AutocompleteService;
type PlacesService = google.maps.places.PlacesService;
type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type PlaceResult = google.maps.places.PlaceResult;
type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;

export function useGoogleMapsApi(googleApiKey: string): ScriptStatus {
  return useScript(`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`, {
    key: 'google-maps-api',
  });
}

export function useAutocompleteService(): RefObject<AutocompleteService | undefined> {
  const autocompleteService = useRef<AutocompleteService | undefined>();

  function loadService() {
    if (window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (!loadService()) {
      document.addEventListener('script-loaded', loadService);
      return () => {
        document.removeEventListener('script-loaded', loadService);
      };
    }
    return undefined;
  }, []);

  return autocompleteService;
}

export function usePlacesService(): RefObject<PlacesService | undefined> {
  const placesService = useRef<PlacesService | undefined>();

  function loadService(): boolean {
    if (window.google) {
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      );
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (!loadService()) {
      document.addEventListener('script-loaded', loadService);
      return () => {
        document.removeEventListener('script-loaded', loadService);
      };
    }
    return undefined;
  }, []);

  return placesService;
}

type GetPlacePrediction = (input: string) => void;

export type PredictionType =
  | 'geocode'
  | 'address'
  | 'establishment'
  | 'locality'
  | 'sublocality'
  | 'postal_code'
  | 'country'
  | 'administrative_area_level_1'
  | 'administrative_area_level_2';

export function usePlacePredictions(
  query?: string | number | null,
  types: PredictionType[] = ['geocode'],
  country = 'fr',
  callback?: (result: AutocompletePrediction[]) => void,
): AutocompletePrediction[] {
  const autocompleteService = useAutocompleteService();

  const memoizedQuery = useRef<string | null | undefined>();
  const memoizedTypes = useRef<string[] | undefined>();
  const memoizedCountry = useRef<string | undefined>();

  const getPlacePredictionsDebounced = useRef<_.DebouncedFunc<GetPlacePrediction> | undefined>();

  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);

  useEffect(() => {
    if (!_.isEqual(memoizedTypes.current, types) || !_.isEqual(memoizedCountry.current, country)) {
      memoizedTypes.current = types;
      memoizedCountry.current = country;

      const getPlacePrediction = (input: string): void => {
        if (!autocompleteService.current) {
          console.error('Google autocomplete service not loaded !');
          return; // TODO : Alert user
        }
        autocompleteService.current.getPlacePredictions(
          {
            input,
            types,
            componentRestrictions: {
              country,
            },
          },
          (result, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              result &&
              result.length > 0
            ) {
              setPredictions(result);
              if (callback) {
                callback(result);
              }
            } else {
              setPredictions([]);
              if (callback) {
                callback([]);
              }
            }
          },
        );
      };

      getPlacePredictionsDebounced.current = _.debounce(getPlacePrediction, 500);
    }
  }, [autocompleteService, callback, country, types]);

  useEffect(() => {
    if (getPlacePredictionsDebounced?.current) {
      if (query && typeof query === 'string' && query.length) {
        if (!_.isEqual(memoizedQuery.current, query)) {
          memoizedQuery.current = query;
          getPlacePredictionsDebounced.current(query);
        }
      } else {
        getPlacePredictionsDebounced.current.cancel();
        setPredictions([]);
      }
    }
  }, [query]);

  return predictions;
}

export function usePlaceDetails(
  placeId: string,
  callback?: (result: PlaceResult | undefined) => void,
): PlaceResult | undefined {
  const placesService = usePlacesService();

  const memoizedPlaceId = useRef<string | undefined>();
  const [placeDetails, setPlaceDetails] = useState<PlaceResult | undefined>();

  useEffect(() => {
    if (placesService.current && placeId && placeId.length && memoizedPlaceId.current !== placeId) {
      memoizedPlaceId.current = placeId;
      placesService.current.getDetails(
        { placeId },
        (result: PlaceResult, status: PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setPlaceDetails(result);
            if (callback) {
              callback(result);
            }
          } else {
            setPlaceDetails(undefined);
            if (callback) {
              callback(undefined);
            }
          }
        },
      );
    }
  }, [callback, placeId, placesService]);

  return placeDetails;
}

type PlaceDetailsGetter = (placeId: string) => Promise<PlaceResult>;

export function usePlaceDetailsGetter(): PlaceDetailsGetter {
  const placesService = usePlacesService();

  return useCallback<PlaceDetailsGetter>(
    (placeId: string) => {
      return new Promise((resolve, reject) => {
        if (!placesService.current) {
          reject(new Error('Google API not loaded'));
          return;
        }
        placesService.current.getDetails(
          { placeId },
          (result: PlaceResult, status: PlacesServiceStatus) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(result);
            } else {
              reject(new Error(`Google API error: ${status}`));
            }
          },
        );
      });
    },
    [placesService],
  );
}
