import { useParams } from 'react-router-dom';
import StaffContainer from '../components/StaffContainer';

function StaffDetails() {

  let {ppecID} = useParams()

  return (
    <div className="StaffDetails">
        <StaffContainer id={ppecID} />
    </div>
  );
}

export default StaffDetails;