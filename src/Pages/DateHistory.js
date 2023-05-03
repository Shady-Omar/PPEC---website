import { useParams } from 'react-router-dom';
import DateDetails from '../components/DateDetails';

function DateHistory() {

  let {ppecID} = useParams()
  let {Date} = useParams()

  return (
    <div className="DateHistory">
        <DateDetails date={Date} id={ppecID}/>
    </div>
  );
}

export default DateHistory;