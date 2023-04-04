import tt from '@tomtom-international/web-sdk-maps';
import { Form, Select, SelectProps, Spin } from 'antd';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useState } from 'react';
import { useMap } from '~/context/map.context';
import useLocation from '~/store/location';

type Props = {
  type?: 'START' | 'END';
};

const Search = ({ type }: Props) => {
  const { map } = useMap();
  const [loading, setLoading] = useState<boolean>(false);
  const { setStartPoint, setEndPoint } = useLocation();
  const [startMarker, setStartMarker] = useState<tt.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<tt.Marker | null>(null);
  const [options, setOptions] = useState<SelectProps['options']>([]);

  const placeholder = type === 'START' ? 'Bắt đầu' : 'Kết thúc';

  const handelSearch = async (value: string) => {
    if (!value) {
      return;
    }
    setLoading(true);

    const baseUrl = `https://api.tomtom.com/search/2/search/${decodeURIComponent(value)}.json`;

    axios
      .get(baseUrl, {
        params: {
          countrySet: 'VN/VNM',
          key: 'ZOGy21WlSKlvwZ8eMPodv71OESuHIerH',
        },
      })
      .then((response) => {
        const addresses = response.data.results.map((v: any) => {
          const parts = v.address.freeformAddress.split(',');
          return {
            p1: parts.lenght > 0 ? parts[0] : null,
            p2: parts.lenght > 1 ? parts[1] : null,
            p3: parts.lenght > 2 ? parts[2] : null,
            address: v.address.freeformAddress,
            lat: v.position.lat,
            lon: v.position.lon,
          };
        });
        setOptions(
          addresses.map((ad: any) => {
            return {
              label: ad.address,
              value: JSON.stringify({
                address: ad.address,
                lat: ad.lat,
                lon: ad.lon,
              }),
            };
          }),
        );
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('ERROR!!!', error.message);
        }
        setLoading(false);
      });
  };

  return (
    <Form.Item label={type === 'START' ? 'Điểm bắt đầu' : 'Điểm kết thúc'}>
      <Select
        showSearch
        onSearch={debounce(handelSearch, 800)}
        style={{
          width: '100%',
        }}
        placeholder={placeholder}
        options={options}
        loading={loading}
        filterOption={false}
        notFoundContent={loading ? <Spin size='small' /> : null}
        onSelect={(value) => {
          const { lat, lon } = JSON.parse(value);
          if (startMarker) {
            startMarker.remove();
          }
          if (endMarker) {
            endMarker.remove();
          }
          // @ts-ignore
          map?.flyTo({ center: [lon, lat], minZoom: 14, speed: 2 });
          if (type === 'END') {
            setStartPoint({ lat, lng: lon });
            const marker = new tt.Marker();
            marker.setLngLat([lon, lat]).addTo(map as tt.Map);
            setStartMarker(marker);
          } else {
            setEndPoint({ lng: lon, lat: lat });
            const marker = new tt.Marker();
            marker.setLngLat([lon, lat]).addTo(map as tt.Map);
            setEndMarker(marker);
          }
        }}
      />
    </Form.Item>
  );
};

export default Search;
