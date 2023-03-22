import tt, { Map } from '@tomtom-international/web-sdk-maps';
import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export interface IMapContext {
  map: Map | null;
  location: {
    lat: number;
    lnt: number;
  };
}

const MapContext = createContext<IMapContext>({
  map: null,
  location: {
    lat: 10.762622,
    lnt: 106.660172,
  },
});

const MapProvider = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [location, setLocation] = useState<IMapContext['location']>({
    lat: 10.762622,
    lnt: 106.660172,
  });

  useEffect(() => {
    const mapEl = document.querySelector('#map');

    const map = tt.map({
      key: 'xuETmAIdAk4OlsACWCeSf8N0PMv79g6N',
      container: mapEl as HTMLElement,
      center: [location.lnt, location.lat],
      zoom: 16,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
    });
    setMap(map);
    return () => {
      map.remove();
    };
  }, [location]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lnt: position.coords.longitude,
        });
      },
      () => {
        setLocation({
          lat: 10.762622,
          lnt: 106.660172,
        });
      },
    );
  }, []);

  return (
    <MapContext.Provider
      value={{
        map,
        location,
      }}
    >
      <Outlet />
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);

export default MapProvider;
