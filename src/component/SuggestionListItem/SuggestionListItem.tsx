import { Button } from 'antd';
import './SuggestionListItem.scss';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useMap } from '~/context/map.context';
interface Props {
  data: object;
  onPressItem: (item: any) => void;
}

function SuggestionListItem({ data, onPressItem }: Props) {
  return (
    <div className='suggestion-item'>
      <EnvironmentOutlined />
      <Button
        type='text'
        onClick={() => {
          onPressItem(data);
        }}
        className='suggestion-item__btn'
      >
        {data.address}
      </Button>
    </div>
  );
}

export default SuggestionListItem;
