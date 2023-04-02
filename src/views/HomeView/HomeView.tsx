import tt from '@tomtom-international/web-sdk-maps';
import tts, { TravelMode } from '@tomtom-international/web-sdk-services';
import { Col, Row, Select, Space, Tabs } from 'antd';
import { DownOutlined, StarOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { CheckPunishment } from '~/component';
import Search from '~/component/Search/Search';
import { useMap } from '~/context/map.context';
import useLocation from '~/store/location';
import './homeview.scss';
import { Option } from 'antd/es/mentions';
import { arrIcon } from '../../assets/icon';
const HomeView = () => {
  const { map, location } = useMap();
  const { startPoint, endPoint } = useLocation();
  const [travel, setTravel] = useState('car');
  console.log(startPoint, endPoint);
  console.log(Object.keys(startPoint).length > 0, Object.keys(endPoint).length > 0);

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
      travelMode: `${travel}` as TravelMode,
    };
    routeOptions.locations.push(startPoint);
    routeOptions.locations.push(endPoint);
    tts.services
      .calculateRoute(routeOptions)
      .then(function (routeData: tts.CalculateRouteResponse) {
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
  }, [startPoint, endPoint, map, travel]);
  return (
    <div className='home-view'>
      <Row>
        <Col xs={24} md={8}>
          <Space
            direction='vertical'
            style={{
              width: '100%',
              padding: 16,
            }}
          >
            <Tabs
              items={[
                {
                  key: '1',
                  label: 'Tiềm kiếm tuyến đường',
                  children: (
                    <div className='options'>
                      <Search type='startpoint' placeholder='Điểm bắt đầu' />
                      <Search type='endpoint' placeholder='Điểm kết thúc' />
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Kiểm tra phạt nguội',
                  children: <CheckPunishment />,
                },
              ]}
            />
          </Space>
        </Col>
        <Col xs={24} md={16}>
          <div id='map' className='home-view__map' />
        </Col>
      </Row>
    </div>
  );
};

export default HomeView;
