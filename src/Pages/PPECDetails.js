import Details from '../components/Details';

function PPECDetails() {

  const { state } = this.props.location

  return (
    <div className="Details">
        <h1>{state}</h1>
        <Details/>
    </div>
  );
}

export default PPECDetails;