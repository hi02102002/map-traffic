import tt, { Map } from '@tomtom-international/web-sdk-maps';
import tts from '@tomtom-international/web-sdk-services';
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
      pitch: 60,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    setMap(map);
    new tt.Popup()
      .setLngLat([location.lnt, location.lat])
      .setHTML(
        '<div class="tt-pop-up-container">' +
          '<div class="pop-up-content">' +
          'Click đâu đó trên đường để có thông tin về dữ liệu lưu lượng giao thông.' +
          '</div>' +
          '</div>',
      )
      .addTo(map);
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
  const roadType = {
    FRC0: 'Đường cao tốc hoặc đường chính khác',
    FRC1: 'Đường chính, không quan trọng bằng đường cao tốc',
    FRC2: 'Đường chính khác',
    FRC3: 'Đường phụ',
    FRC4: 'Đường nối địa phương',
    FRC5: 'Đường địa phương quan trọng',
    FRC6: 'Đường địa phương',
    FRC7: 'Đường địa phương không quan trọng',
    FRC8: 'Đường khác',
  };

  useEffect(() => {
    map?.on('click', (e) => {
      const callParameters = {
        key: 'xuETmAIdAk4OlsACWCeSf8N0PMv79g6N',
        point: e.lngLat,
        style: 'relative0',
        unit: 'KMPH',
        zoom: Math.floor(map.getZoom()),
      };
      tts.services.trafficFlowSegmentData(callParameters).then((respone) => {
        const points = respone.flowSegmentData?.coordinates?.coordinate;

        if (map.getLayer('route1')) {
          map?.removeLayer('route1');
          map.removeSource('route1');
          map.addLayer({
            id: 'route1',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: points?.map((point) => {
                    return [point.lng, point.lat];
                  }),
                },
              },
            },
            layout: {
              'line-cap': 'round',
            },
            paint: {
              'line-color': 'yellow',
              'line-width': 5,
            },
          });
        } else {
          map.addLayer({
            id: 'route1',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: points?.map((point) => {
                    return [point.lng, point.lat];
                  }),
                },
              },
            },
            layout: {
              'line-cap': 'round',
            },
            paint: {
              'line-color': 'yellow',
              'line-width': 5,
            },
          });
        }
        new tt.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            '<div class="tt-pop-up-container">' +
              '<div class="pop-up-content">' +
              '<div>' +
              '<div class="pop-up-result-header">' +
              roadType[respone.flowSegmentData?.frc] +
              '</div>' +
              '<div class="pop-up-result-title">Tốc độ trung bình:</div>' +
              '<div class="pop-up-result-traffic -important">Có giao thông: ' +
              respone.flowSegmentData?.currentSpeed +
              '  km/h' +
              '</div>' +
              '<div class="pop-up-result-traffic">Không có giao thông: ' +
              respone.flowSegmentData?.freeFlowSpeed +
              '  km/h' +
              '</div>' +
              '<div class="pop-up-result-title">Thời gian di chuyển:</div>' +
              '<div class="pop-up-result-traffic -important">Có giao thông: ' +
              Math.floor(respone.flowSegmentData?.currentTravelTime / 60) +
              ' m ' +
              (respone.flowSegmentData?.currentTravelTime % 60) +
              ' s ' +
              '</div>' +
              '<div class="pop-up-result-traffic">Không có giao thông: ' +
              Math.floor(respone.flowSegmentData?.freeFlowTravelTime / 60) +
              ' m ' +
              (respone.flowSegmentData?.freeFlowTravelTime % 60) +
              ' s ' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>',
          )
          .addTo(map);
      });
    });
  });

  useEffect(() => {
    map?.on('load', function () {
      map.getStyle().layers.filter((layer) => {
        const hasExtrusion = layer.type === 'fill-extrusion';
        // const has3dArea = layer.metadata === 'group:area_3d';

        if (hasExtrusion) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
          map.setPaintProperty(layer.id, 'fill-extrusion-opacity-transition', {
            delay: 0,
            duration: 2000,
          });
        }
      });
    });
  });
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
