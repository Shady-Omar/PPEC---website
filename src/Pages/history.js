import { useParams } from 'react-router-dom';
import HistoryDetails from "../components/HistoryDetails";

function History() {

  let {ppecID} = useParams()

  return (
    <div className="History">
        <HistoryDetails id={ppecID}/>
    </div>
  );
}

export default History;