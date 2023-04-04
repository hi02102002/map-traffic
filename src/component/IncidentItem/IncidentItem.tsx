import Text from 'antd/es/typography/Text';
import './IncidentItem.scss';
import tts from '@tomtom-international/web-sdk-services';
import { useMap } from '~/context/map.context';

interface Props {
  data: tts.IncidentResultV5;
}
// { icon, from, to, delay, length }: Props
function IncidentItem({ data }: Props) {
  const { map } = useMap();
  console.log(data.properties?.iconCategory);

  let roadLength = 0;
  if (data.properties && data.properties.length) {
    roadLength = data.properties.length;
  }

  function handleClick() {
    // @ts-ignore
    map?.flyTo({ center: data.geometry?.coordinates[0], minZoom: 10, speed: 2, curve: 1.42 });
  }

  let timeDelay = 0;
  if (data.properties && data.properties?.delay) {
    timeDelay = data.properties.delay;
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className='incident-list-item'
      onClick={() => {
        handleClick();
      }}
      role='button'
      tabIndex={0}
    >
      <div className='incident-details' style={{ width: '45%' }}>
        {/* <div className='traffic-icon-wrap'>
          <div className='traffic-icon'>1</div>
        </div> */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text className='incident-start'>{data.properties?.from}</Text>
          <Text className='incident-end'>{data.properties?.to}</Text>
        </div>
      </div>
      <div style={{ width: '27.5%' }}>
        <Text className=''>
          {data.properties?.delay == null
            ? 'No delay'
            : Math.floor(timeDelay / 60) + 'm' + (timeDelay % 60) + 's'}
        </Text>
      </div>
      <div>
        <Text className='' style={{ width: '27.5%' }}>
          {Math.floor(roadLength)}m
        </Text>
      </div>
    </div>
  );
}

export default IncidentItem;
