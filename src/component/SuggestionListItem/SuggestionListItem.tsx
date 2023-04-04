import { EnvironmentOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './SuggestionListItem.scss';

interface data {
  address: string;
}
interface Props {
  data: data;
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
