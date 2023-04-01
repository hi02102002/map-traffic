import tt from '@tomtom-international/web-sdk-maps';
import tts, { TravelMode } from '@tomtom-international/web-sdk-services';
import { Col, Row, Select } from 'antd';
import { DownOutlined, StarOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useMap } from '~/context/map.context';
import './homeview.scss';
import Search from '~/component/Search/Search';
import useLocation from '~/store/location';
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
  }, [startPoint, endPoint, map, travel]);

  function handeChangeTravel(value: string) {
    setTravel(value);
  }
  return (
    <div className='home-view'>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <div className='options'>
            <div className='search'>
              <Search type='startpoint' placeholder='Điểm bắt đầu' />
              <Search type='endpoint' placeholder='Điểm kết thúc' />
            </div>
            <div className='travel-mode'>
              <Select
                style={{ width: 150, marginLeft: 40 }}
                suffixIcon={<DownOutlined />}
                optionLabelProp='label'
                onChange={handeChangeTravel}
                defaultValue='car'
              >
                {arrIcon.map((icon, index) => {
                  return (
                    <Option key={index.toString()} value={icon.type}>
                      <div className='travel-mode-item' style={{ paddingRight: 10 }}>
                        {icon.type.charAt(0).toUpperCase() + icon.type.slice(1)}
                      </div>
                      <div className='travel-mode-icon' style={{ width: 20, height: 20 }}>
                        {icon.icon}
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </div>
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
