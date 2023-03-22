import tt from '@tomtom-international/web-sdk-maps';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useMap } from '~/context/map.context';
import './homeview.scss';
const HomeView = () => {
  const { map, location } = useMap();

  useEffect(() => {
    if (map) {
      const marker = new tt.Marker();
      marker.setLngLat([location.lnt, location.lat]).addTo(map as tt.Map);
    }
  }, [map, location]);

  return (
    <div className='home-view'>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}></Col>
        <Col xs={24} md={16}>
          <div id='map' className='home-view__map' />
        </Col>
      </Row>
    </div>
  );
};

export default HomeView;
