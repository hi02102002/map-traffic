import tt from '@tomtom-international/web-sdk-maps';
import tts, { TravelMode } from '@tomtom-international/web-sdk-services';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useMap } from '~/context/map.context';
import './homeview.scss';
import Search from '~/component/Search/Search';
import useLocation from '~/store/location';
const HomeView = () => {
  const { map, location } = useMap();
  const { startPoint, endPoint } = useLocation();
  console.log(startPoint, endPoint);

  useEffect(() => {
    if (map) {
      const marker = new tt.Marker();
      marker.setLngLat([location.lnt, location.lat]).addTo(map as tt.Map);
    }
  }, [map, location]);

  useEffect(() => {
    const routeOptions = {
      key: 'xuETmAIdAk4OlsACWCeSf8N0PMv79g6N',
      locations: [],
      travelMode: '' as TravelMode,
    };

    routeOptions.locations.push(startPoint);
    routeOptions.locations.push(endPoint);
    // console.log(map?.getLayer('route'));

    tts.services.calculateRoute(routeOptions).then(function (routeData: any) {
      console.log(routeData);
      if (map?.getLayer('route')) {
        map?.removeLayer('route');
        map.removeSource('route');
        map?.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: routeData.toGeoJson(),
          },
          paint: {
            'line-color': 'blue',
            'line-width': 5,
          },
        });
      } else {
        map?.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: routeData.toGeoJson(),
          },
          paint: {
            'line-color': 'blue',
            'line-width': 5,
          },
        });
      }
    });
  }, [startPoint, endPoint, map]);
  return (
    <div className='home-view'>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <div className='options'>
            <Search type='startpoint' placeholder='Điểm bắt đầu' />
            <Search type='endpoint' placeholder='Điểm kết thúc' />
          </div>
        </Col>
        <Col xs={24} md={16}>
          <div id='map' className='home-view__map' />
        </Col>
      </Row>
    </div>
  );
};

export default HomeView;
