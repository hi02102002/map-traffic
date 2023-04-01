import axios from 'axios';
import { useEffect, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import { Input } from 'antd';

import { useMap } from '~/context/map.context';
import Suggestion from '../Suggestion';
import useLocation from '~/store/location';
import './Search.scss';
interface Props {
  type: string;
  placeholder: string;
}

function Search({ type, placeholder }: Props) {
  const { map, location } = useMap();
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
