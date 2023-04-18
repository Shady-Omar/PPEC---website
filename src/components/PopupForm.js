import React, { useState } from 'react';

function PopupForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [centerName, setCenterName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setCenterName("");
      setStreetAddress("");
      setCity("");
      setState("");
      setZipCode("");
      setDaysOfWeek({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      });
      setOpeningTime("");
      setClosingTime("");
    }, 2000);
  }

  return (
    <div className="relative m-8">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        onClick={() => setIsOpen(true)}
      >
        Add PPEC Center
      </button>

      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <form
            className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-2/3"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold mb-4">PPEC Center Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="center-name">
                PPEC Center Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                id="center-name"
                type="text"
                placeholder="Enter PPEC Center Name"
                value={centerName}
                onChange={(event) => setCenterName(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="street-address">
                PPEC Center Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                id="street-address"
                type="text"
                placeholder="Enter Street Address"
                value={streetAddress}
                onChange={(event) => setStreetAddress(event.target.value)}
              />
              <div className='flex flex-row justify-between my-4'>
                <input
                  className="shadow appearance-none border rounded w-[32%] py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  id="ppec-city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <select
                  className="shadow appearance-none cursor-pointer border rounded w-[32%] py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  id="ppec-state"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                >
                  <option className='text-gray-700' value="">Select a state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>              
                <input
                  className="shadow appearance-none border rounded w-[32%] py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  id="ppec-zip"
                  type="text"
                  placeholder="Zip code"
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-gray-700 font-bold" htmlFor="street-address">
                Operational Hours
              </label>
              <div className='flex flex-row justify-between w-full flex-wrap md:justify-between my-4 md:w-[90%]'>
                <label htmlFor="sunday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="sunday"
                    name="daysOfWeek"
                    value={daysOfWeek.sunday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Sunday</span>
                </label>
                <label htmlFor="monday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="monday"
                    name="daysOfWeek"
                    value={daysOfWeek.monday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Monday</span>
                </label>
                <label htmlFor="tuesday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="tuesday"
                    name="daysOfWeek"
                    value={daysOfWeek.tuesday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Tuesday</span>
                </label>
                <label htmlFor="wednesday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="wednesday"
                    name="daysOfWeek"
                    value={daysOfWeek.wednesday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Wednesday</span>
                </label>
                <label htmlFor="thursday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="thursday"
                    name="daysOfWeek"
                    value={daysOfWeek.thursday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Thursday</span>
                </label>
                <label htmlFor="friday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="friday"
                    name="daysOfWeek"
                    value={daysOfWeek.friday}
                    className="form-checkbox h-5 w-5 text-blue-600"

                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Friday</span>
                </label>
                <label htmlFor="saturday" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="saturday"
                    name="daysOfWeek"
                    value={daysOfWeek.saturday}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  
                    onChange={(event) => setDaysOfWeek(event.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Saturday</span>
                </label>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-4 my-4">
                <label htmlFor="opening-time" className="text-gray-700">
                  Opening Time
                </label>
                <input
                  type="time"
                  id="opening-time"
                  name="openingTime"
                  value={openingTime}
                  className="shadow appearance-none border rounded w-28 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setOpeningTime(event.target.value)}
                />
                <label htmlFor="closing-time" className="text-gray-700">
                  Closing Time
                </label>
                <input
                  type="time"
                  id="closing-time"
                  name="closingTime"
                  value={closingTime}
                  className="shadow appearance-none border rounded w-28 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setClosingTime(event.target.value)}
                />
              </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                type="submit"
              >
                Submit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {isSubmitted && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsSubmitted(false)}
        >
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p>Your form has been submitted.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupForm;
