import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { View, Dimensions, Platform, PermissionsAndroid, Image } from 'react-native';
import MapboxGL, { UserLocation } from '@rnmapbox/maps';
import Marker from './Marker';
import useStore from '../../state/store.ts';
import useSWR from 'swr';
import { getPOSList } from '@services/api/pos';
import { throttle } from 'lodash';
import { CameraRef } from 'node_modules/@rnmapbox/maps/lib/typescript/src/components/Camera';
import { dp } from '@utils/dp.ts';

export type CameraReference = {
  setCameraPosition: (val?: {
    longitude?: number;
    latitude?: number;
    zoomLevel?: number;
    animationDuration?: number;
  }) => void;
};

const DEFAULT_LOCATION = {
  longitude: 37.618423,
  latitude: 55.751244,
};

let globalShouldAutoSetCamera = true;

const Map = forwardRef<CameraReference, any>(({ userLocationRef }: any, ref) => {
  const {
    posList,
    setPosList,
    location,
    setLocation,
    business,
    setOriginalPosList,
  } = useStore.getState();

  const { data, error } = useSWR('getPOSList', () => getPOSList({}), {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const [locationFound, setLocationFound] = useState(false);

  const cameraRef = React.useRef<CameraRef>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);


  useEffect(() => {
    if (data && data.businessesLocations) {
      setOriginalPosList(data.businessesLocations);
      setPosList(data.businessesLocations);
    }
  }, [data, error, setPosList, setOriginalPosList]);

  const memoizedBusinesses = useMemo(
    () =>
      posList && posList.length
        ? posList.map(businessItem => (
            <Marker
              key={`${businessItem.carwashes[0].id}-${businessItem.location.lat}-${businessItem.location.lon}`}
              coordinate={[
                businessItem.location.lon,
                businessItem.location.lat,
              ]}
              locationRef={userLocationRef}
              business={businessItem}
              isSelected={
                businessItem.carwashes[0].id === business?.carwashes[0].id
              }
            />
          ))
        : [],
    [posList, business],
  );

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
          setHasLocationPermission(hasPermission);
        } else {
          setHasLocationPermission(true);
        }
      } catch (err) {
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const hasValidLocation = location &&
      location.latitude !== undefined &&
      location.longitude !== undefined &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude);

    if (globalShouldAutoSetCamera && hasLocationPermission && locationFound && hasValidLocation) {

      globalShouldAutoSetCamera = false;

      cameraRef.current?.setCamera({
        centerCoordinate: [
          location.longitude,
          location.latitude,
        ],
        zoomLevel: 16,
        pitch: 1,
        animationMode: 'flyTo',
        animationDuration: 2000,
        padding: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 300,
        },
      });

    }
  }, [hasLocationPermission, locationFound, location]);

  const onUserLocationUpdateThrottled = useMemo(
    () =>
      throttle((userLocation) => {
        const { latitude: lat, longitude: lon } = userLocation.coords;

        if (lat === undefined || lon === undefined) {
          return;
        }

        if (!locationFound) {
          setLocationFound(true);
        }

        setLocation({ latitude: lat, longitude: lon });

        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [lon, lat],
            zoomLevel: 16,
            pitch: 1,
            animationMode: 'flyTo',
            animationDuration: 1000,
            padding: {
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 300,
            },
          });
        }
      }, 1000),
    [setLocation, locationFound],
  );

  const setCameraPosition = useCallback((val?: {
    longitude?: number;
    latitude?: number;
    zoomLevel?: number;
    animationDuration?: number;
  }) => {
    globalShouldAutoSetCamera = false;

    requestAnimationFrame(() => {
      const currentLocation = useStore.getState().location;

      const targetLongitude = val?.longitude !== undefined
        ? val.longitude
        : (currentLocation?.longitude ?? DEFAULT_LOCATION.longitude);

      const targetLatitude = val?.latitude !== undefined
        ? val.latitude
        : (currentLocation?.latitude ?? DEFAULT_LOCATION.latitude);
        

      if (!cameraRef.current) {
        return;
      }

      cameraRef.current.setCamera({
        centerCoordinate: [targetLongitude, targetLatitude],
        zoomLevel: val?.zoomLevel ?? 16,
        pitch: 1,
        animationMode: 'flyTo',
        animationDuration: val?.animationDuration ?? 1000,
        padding: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 300,
        },
      });
    });
  }, []);

  useImperativeHandle(ref, () => ({
    setCameraPosition: setCameraPosition,
  }));

  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        position: 'absolute',
      }}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        zoomEnabled={true}
        scaleBarEnabled={false}
        styleURL={'mapbox://styles/mapbox/light-v11'}
        preferredFramesPerSecond={120}>
        {memoizedBusinesses}
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          pitch={1}
          animationMode="flyTo"
          animationDuration={4000}
          followUserLocation={false}
          centerCoordinate={[
            location?.longitude ?? DEFAULT_LOCATION.longitude,
            location?.latitude ?? DEFAULT_LOCATION.latitude,
          ]}
        />
        <UserLocation
          visible={hasLocationPermission}
          showsUserHeadingIndicator={true}
          requestsAlwaysUse={true}
          onUpdate={onUserLocationUpdateThrottled}
          animated={true}
        />

      </MapboxGL.MapView>

      <View
        style={{
          position: 'absolute',
          top: dp(0),
          left: dp(0),
          right: dp(0),
          height: dp(85),
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          ...Platform.select({
            ios: {
              top: dp(20),
            },
          }),
        }}
      >
        <Image
          source={require('../../assets/images/garland.webp')}
          style={{
            width: '100%',
            height: dp(85),
            resizeMode: 'stretch',
          }}
        />
      </View>

      {business && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
          onStartShouldSetResponder={() => true}
        />
      )}
    </View>
  );
});

export { Map };
