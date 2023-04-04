import Text from 'antd/es/typography/Text';
import tts from '@tomtom-international/web-sdk-services';

import './Incident.scss';
import IncidentItem from '../IncidentItem/IncidentItem';
import { useEffect, useState } from 'react';
import { useMap } from '~/context/map.context';
import { List } from 'antd';

function Incident() {
  const { map } = useMap();
  const [incidentArr, setIncidentArr] = useState<tts.IncidentResultV5[]>();
  console.log(incidentArr);

  useEffect(() => {
    map?.on('moveend', () => {
      tts.services
        .incidentDetailsV5({
          key: 'ZOGy21WlSKlvwZ8eMPodv71OESuHIerH',
          boundingBox: map?.getBounds(),
          fields:
            '{\n            incidents {\n                type,\n                geometry {\n                    type,\n                    coordinates\n                },\n                properties {\n                    id,\n                    iconCategory,\n                    magnitudeOfDelay,\n                    events {\n                        description,\n                        code,\n                        iconCategory\n                    },\n                    startTime,\n                    endTime,\n                    from,\n                    to,\n                    length,\n                    delay,\n                    roadNumbers,\n                    aci {\n                        probabilityOfOccurrence,\n                        numberOfReports,\n                        lastReportTime\n                    }\n                }\n            }\n        }',
        })
        .then((data) => {
          setIncidentArr(data.incidents);
        });
    });
  }, [map]);

  return (
    <div className='incident'>
      <div className='incident-header'>
        <Text className='incident-header-title'>Incident</Text>
        <Text className='incident-header-title'>Delay</Text>
        <Text className='incident-header-title'>Length</Text>
      </div>
      <div className='incident-list'>
        <List
          dataSource={incidentArr}
          renderItem={(incident) => (
            <List.Item>
              <IncidentItem data={incident}></IncidentItem>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default Incident;
