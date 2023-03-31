import SuggestionListItem from '../SuggestionListItem';
import './Suggestion.scss';

interface Props {
  showList: boolean;
  onPressItem: (item: any) => void;
  data: object[];
}

function Suggestion({ showList, onPressItem, data }: Props) {
  return showList == true ? (
    <div className='suggestion-main'>
      {data.map((dt, index) => {
        return (
          <SuggestionListItem data={dt} key={index} onPressItem={onPressItem}></SuggestionListItem>
        );
      })}
    </div>
  ) : (
    <></>
  );
}

export default Suggestion;
