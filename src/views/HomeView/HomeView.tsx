import { DownOutlined } from '@ant-design/icons';
import tt from '@tomtom-international/web-sdk-maps';
import tts, { TravelMode } from '@tomtom-international/web-sdk-services';
import { Col, Form, Row, Select, Space, Tabs } from 'antd';
import { Option } from 'antd/es/mentions';
import { useEffect, useState } from 'react';
import { CheckPunishment } from '~/component';
import NewSearch from '~/component/Search/NewSearch';
import { useMap } from '~/context/map.context';
import useLocation from '~/store/location';
import { arrIcon } from '../../assets/icon';
import './homeview.scss';
import Incident from '~/component/Incident/Incident';

const HomeView = () => {
  const { map, location } = useMap();
  const { startPoint, endPoint } = useLocation();
  const [travel, setTravel] = useState('car');
  useEffect(() => {
    if (map) {
      const marker = new tt.Marker();
      marker.setLngLat([location.lnt, location.lat]).addTo(map as tt.Map);
    }
  }, [map, location]);

  useEffect(() => {
    const routeOptions = {
      key: 'ZOGy21WlSKlvwZ8eMPodv71OESuHIerH',
      locations: [] as any[],
      travelMode: `${travel}` as TravelMode,
    };

    routeOptions.locations.push(startPoint);
    routeOptions.locations.push(endPoint);

    if (Object.keys(startPoint).length > 0 && Object.keys(endPoint).length > 0) {
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

          const endPointofRoute = routeData.routes[0].sections[0].startPointIndex;
          let longitudeEnd = 0;
          let latitudeEnd = 0;
          if (routeData.routes[0].legs[0].points[endPointofRoute + 3].lng) {
            longitudeEnd = routeData.routes[0].legs[0].points[endPointofRoute + 3].lng!;
          }

          if (routeData.routes[0].legs[0].points[endPointofRoute + 3].lat) {
            latitudeEnd = routeData.routes[0].legs[0].points[endPointofRoute + 3].lat!;
          }

          const endPointOfRouteConvert = new tt.LngLat(longitudeEnd, latitudeEnd);
          new tt.Popup()
            // .setLngLat(routeData.routes[0].legs[0].points[startPointofRoute + 3])
            .setLngLat(endPointOfRouteConvert)
            .setHTML(
              '<div class="tt-pop-up-container">' +
                '<div class="pop-up-content">' +
                '<div>' +
                '<div class="pop-up-result-header">' +
                'Thông tin tuyến đường' +
                '</div>' +
                '<div class="pop-up-result-title road-length">Khoảng cách:    </div>' +
                '<div class="pop-up-result-traffic -important road-length ">' +
                (routeData.routes[0].summary.lengthInMeters / 1000).toFixed(1) +
                '  km' +
                '</div>' +
                '</div>' +
                '<div class="pop-up-result-title road-length">Thời gian di chuyển:</div>' +
                '<div class="pop-up-result-traffic -important road-length">' +
                Math.floor(routeData.routes[0].summary.travelTimeInSeconds / 60) +
                ' m ' +
                Math.floor(routeData.routes[0].summary.travelTimeInSeconds % 60) +
                ' s ' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            )
            .addTo(map as tt.Map);
        });
    }
  }, [startPoint, endPoint, map, travel]);

  function handeChangeTravel(value: string) {
    setTravel(value);
  }
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
                  label: 'Tìm kiếm tuyến đường',
                  children: (
                    <div className='options'>
                      <Form layout='vertical'>
                        <NewSearch type='START' />
                        <NewSearch type='END' />
                        <Form.Item label='Chọn phương tiện'>
                          <Select
                            style={{ width: '100%' }}
                            suffixIcon={<DownOutlined />}
                            optionLabelProp='label'
                            onChange={handeChangeTravel}
                            defaultValue='car'
                          >
                            {arrIcon.map((icon, index) => {
                              return (
                                <Option key={index.toString()} value={icon.type}>
                                  <Space align='center'>
                                    <div className='travel-mode-item' style={{ paddingRight: 10 }}>
                                      {icon.type.charAt(0).toUpperCase() + icon.type.slice(1)}
                                    </div>
                                    <div
                                      className='travel-mode-icon'
                                      style={{ width: 20, height: 20 }}
                                    >
                                      {icon.icon}
                                    </div>
                                  </Space>
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Form>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Kiểm tra phạt nguội',
                  children: <CheckPunishment />,
                },
                {
                  key: '3',
                  label: 'Sự cố giao thông',
                  children: <Incident />,
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
