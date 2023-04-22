import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '250px'
};

const center = {
  lat: 25.761681,
  lng: -80.191788
};

function LocationPicker() {
  const [selected, setSelected] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState('');
  const [zipCode, setZipCode] = useState("");

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

  const onSelect = item => {
    setSelected(item);
  }

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   console.log(search);
  // }

  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 10,
    });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: search }, (results, status) => {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        const marker = new window.google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        // console.log('Geocode was not successful for the following reason:', status);
      }
    });
  }, [search]);

  return (
    <div className="mb-4">
      <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="street-address">
                PPEC Center Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                id="street-address"
                type="text"
                placeholder="Enter Street Address"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <p id='err-address' className='text-left !mt-4 text-sm text-red-600 hidden'>* Center Address is required</p>
              <div className='flex flex-row justify-between my-4'>
                <div className='w-[32%]'>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                    id="ppec-city"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                  <p id='err-city' className='text-left !mt-4 text-sm text-red-600 hidden'>* City is required</p>
                </div>
                <div className='w-[32%]'>
                <select id="state-select" className="shadow appearance-none cursor-pointer border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-blue-500 focus:shadow-outline" value={selectedState} onChange={handleChange}>
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
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                />
                <p id='err-zip' className='text-left !mt-4 text-sm text-red-600 hidden'>* Zip code is required</p>
                </div>
              </div>
            </div>

      <div id="map" style={containerStyle}></div>
    </div>
  );
}

export default LocationPicker;
