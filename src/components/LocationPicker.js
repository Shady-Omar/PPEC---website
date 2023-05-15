import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import Geocode from "react-geocode";

const mapContainerStyle = {
  width: '100%',
  height: '250px'
};

// const center = {
//   lat: 25.761681,
//   lng: -80.191788
// };

function LocationPicker() {
  const [selected, setSelected] = React.useState(null);
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState('');
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState(''); // in meters
  const [center, setCenter] = useState({
    lat: 25.761681,
    lng: -80.191788
  });

  const handleChange = (event) => {
    setSelectedState(event.target.value);
  }
  

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ];

  const options = states.map((state) => (
    <option key={state} value={state}>{state}</option>
  ));

  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 13,
    });

    const marker = new window.google.maps.Marker({
      map: map,
    });

    const circle = new window.google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      radius: 500,
      map: map,
    });

    window.google.maps.event.addListener(map, 'click', (event) => {      
        marker.setPosition(event.latLng);
        circle.setCenter(event.latLng);
        setCenter(event.latLng);
        setRadius(radius);


      Geocode.setApiKey("AIzaSyC52uvc5kD2YvHTPot-yN1HweJ_b3qIGKQ");
      setLat(`${event.latLng.lat()}`)
      setLng(`${event.latLng.lng()}`)
      Geocode.fromLatLng(event.latLng.lat(), event.latLng.lng()).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setAddress(address);
          let city, state, zip;
          for (let i = 0; i < response.results[0].address_components.length; i++) {
            for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
              switch (response.results[0].address_components[i].types[j]) {
                case "locality":
                  city = response.results[0].address_components[i].long_name;
                  break;
                case "administrative_area_level_1":
                  state = response.results[0].address_components[i].long_name;
                  break;
                // case "country":
                //   country = response.results[0].address_components[i].long_name;
                //   break;
                case "postal_code":
                  zip = response.results[0].address_components[i].long_name;
                  break;
                  default:
              }
            }
          }
          setCity(city);
          setSelectedState(state);
          setZipCode(zip);
        },
        (error) => {
          console.error(error);
        }
      );
    })



    
    // const geocoder = new window.google.maps.Geocoder();
    // geocoder.geocode({ address: address }, (results, status) => {
    //   if (status === 'OK') {
    //     map.setCenter(results[0].geometry.location);
    //     const marker = new window.google.maps.Marker({
    //       map: map,
    //       position: results[0].geometry.location
    //     });
    //   } else {
    //     // console.log('Geocode was not successful for the following reason:', status);
    //   }
    // });
  }, [radius]);

  return (
    <div className="mb-4">
      <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="street-address">
                PPEC Center Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                id="street-address"
                type="text"
                placeholder="Enter Street Address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
              <p id='err-address' className='text-left !mt-4 text-sm text-red-600 hidden'>* Center Address is required</p>
              <div className='flex flex-row justify-between my-4'>
                <div className='w-[32%]'>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                    id="ppec-city"
                    type="text"
                    placeholder="City"
                    value={city || ""}
                    onChange={(event) => setCity(event.target.value)}
                  />
                  <p id='err-city' className='text-left !mt-4 text-sm text-red-600 hidden'>* City is required</p>
                </div>
                <div className='w-[32%]'>
                <select id="state-select" className="shadow appearance-none cursor-pointer border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline" value={selectedState || ""} onChange={handleChange}>
                  <option value="" disabled>State</option>
                  {options}
                </select>
                <p id='err-state' className='text-left !mt-4 text-sm text-red-600 hidden'>* State is required</p>
                </div>
                <div className='w-[32%]'>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  id="ppec-zip"
                  type="text"
                  placeholder="Zip code"
                  value={zipCode || ""}
                  onChange={(event) => setZipCode(event.target.value)}
                />
                <p id='err-zip' className='text-left !mt-4 text-sm text-red-600 hidden'>* Zip code is required</p>
                </div>
              </div>
              <select
                className="shadow appearance-none border rounded mb-4 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                id="ppec-radius"
                value={radius}
                onChange={(event) => setRadius(event.target.value)}
              >
                <option value="500">500 meters</option>
                <option value="750">750 meters</option>
                <option value="1000">1000 meters</option>
                <option value="1500">1500 meters</option>
                <option value="2000">2000 meters</option>
                <option value="3000">3000 meters</option>
              </select>
              <input id="lat"
                className=' w-0 h-0'
                value={lat || ""}
                onChange={(event) => setLat(event.target.value)}
              />
              <input id="lng"
                className=' w-0 h-0'
                value={lng || ""}
                onChange={(event) => setLng(event.target.value)}
              />
            </div>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={10}
              id='map'
            >
              {selected ? (
                <InfoWindow
                  position={{ lat: 37.7749, lng: -122.4194 }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div>
                    <h2>{selected}</h2>
                  </div>
                </InfoWindow>
              ) : null}
            </GoogleMap>
    </div>
  );
}

export default React.memo(LocationPicker);
