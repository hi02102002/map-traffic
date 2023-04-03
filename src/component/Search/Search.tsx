import tt from '@tomtom-international/web-sdk-maps';
import { Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';

import { useMap } from '~/context/map.context';
import useLocation from '~/store/location';
import Suggestion from '../Suggestion';
import './Search.scss';
interface Props {
  type: string;
  placeholder: string;
}

function Search({ type, placeholder }: Props) {
  const { map } = useMap();
  const { startPoint, endPoint, setStartPoint, setEndPoint } = useLocation();
  const [valueStartInput, setValueStartInput] = useState('');
  const [showList, setShowList] = useState(false);
  const [suggestionListData, setSuggestionListData] = useState([]);

  const [startMarker, setStartMarker] = useState<tt.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<tt.Marker | null>(null);

  const handleSearchTextChange = (value: string) => {
    if (!value || value.length < 5) {
      return;
    }
    const baseUrl = `https://api.tomtom.com/search/2/search/${value}.json`;
    const searchUrl = baseUrl + `?key=xuETmAIdAk4OlsACWCeSf8N0PMv79g6N`;

    axios
      .get(searchUrl)
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
        setSuggestionListData(addresses);
        setShowList(true);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('ERROR!!!', error.message);
        }
      });
  };
  const onPressItem = (item: any) => {
    if (startMarker) {
      startMarker.remove();
    }
    if (endMarker) {
      endMarker.remove();
    }
    setValueStartInput(item.address);
    map?.flyTo({ center: [item.lon, item.lat], minZoom: 14, speed: 2 });
    setShowList(false);
    if (type === 'startpoint') {
      // const customIconStart = document.createElement('div');
      // customIconStart.className = 'marker-start-icon';
      // customIconStart.style.backgroundImage =
      // 'url(data:image/svg+xml;charset%3DUS-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20width%3D%2230%22%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M20.8%209.25l-14.2%203.8%207.6%202.9%202.9%207.6%22%2F%3E%3C%2Fsvg%3E)';
      setStartPoint({ lng: item.lon, lat: item.lat });
      const marker = new tt.Marker();
      marker.setLngLat([item.lon, item.lat]).addTo(map as tt.Map);
      setStartMarker(marker);
    } else {
      setEndPoint({ lng: item.lon, lat: item.lat });
      const marker = new tt.Marker();
      marker.setLngLat([item.lon, item.lat]).addTo(map as tt.Map);
      setEndMarker(marker);
    }
  };
  return (
    <div className='search'>
      <div className='start-wrap wrap-style' style={{ position: 'relative' }}>
        {type === 'startpoint' ? (
          <div className='start-icon icon'></div>
        ) : (
          <div className='end-icon icon'></div>
        )}

        <Input
          placeholder={placeholder}
          size='middle'
          onChange={(e) => {
            setValueStartInput(e.target.value);
            handleSearchTextChange(e.target.value);
          }}
          allowClear
          value={valueStartInput}
        />
        <Suggestion data={suggestionListData} showList={showList} onPressItem={onPressItem} />
      </div>
    </div>
  );
}

export default Search;
