import { useParams } from 'react-router-dom';
import Details from '../components/Details';

function PPECDetails() {

  let {ppecID} = useParams()

  return (
    <div className="Details  w-full">
        <Details id={ppecID}/>
    </div>
  );
}

export default PPECDetails;