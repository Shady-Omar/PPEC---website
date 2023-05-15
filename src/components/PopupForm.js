import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import { db } from "../firebase.js";
import { collection, addDoc, GeoPoint, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TimePicker from "rc-time-picker";
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

function PopupForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [centerName, setCenterName] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState({
    sunday: 1,
    monday: 2,
    tuesday: 3,
    wednesday: 4,
    thursday: 5,
    friday: 6,
    saturday: 7,
  });
  
  const [selectedDays, setSelectedDays] = useState([]);

  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  function getTodayDateRepresentation() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let centerAddress = document.getElementById('street-address').value;
    let centerCity = document.getElementById('ppec-city').value;
    let centerState = document.getElementById('state-select').value;
    let centerZip = document.getElementById('ppec-zip').value;
    let centerRadius = document.getElementById('ppec-radius').value;
    let lat = document.getElementById('lat').value;
    let lng = document.getElementById('lng').value;
    const geoLocation = new GeoPoint(lat, lng);
    if (centerName === null || centerName === "" || centerAddress === null || centerAddress === "" || centerCity === null || centerCity === "" || centerState === null || centerState === "" || centerZip === null || centerZip === "" || selectedDays.length === 0 || openingTime === '' || openingTime === null || closingTime === '' || closingTime === null || openingTime >= closingTime) {
      if (centerName === null || centerName === "" ) {
        document.getElementById("err-name").classList.remove("hidden");
      } else {
        document.getElementById("err-name").classList.add("hidden");
      }
      if (centerAddress === null || centerAddress === "" ) {
        document.getElementById("err-address").classList.remove("hidden");
      } else {
        document.getElementById("err-address").classList.add("hidden");
      }
      if (centerCity === null || centerCity === "" ) {
        document.getElementById("err-city").classList.remove("hidden");
      } else {
        document.getElementById("err-city").classList.add("hidden");
      }
      if (centerState === null || centerState === "" ) {
        document.getElementById("err-state").classList.remove("hidden");
      } else {
        document.getElementById("err-state").classList.add("hidden");
      }
      // if (centerRadius === null || centerRadius === "") {
      //   document.getElementById("err-state").classList.remove("hidden");
      // } else {
      //   document.getElementById("err-state").classList.add("hidden");
      // }
      if (centerZip === null || centerZip === "" ) {
        document.getElementById("err-zip").classList.remove("hidden");
      } else {
        document.getElementById("err-zip").classList.add("hidden");
      }
      if (selectedDays.length === 0) {
        document.getElementById("err-days").classList.remove("hidden");
      } else {
        document.getElementById("err-days").classList.add("hidden");
      }
      if (openingTime === null || openingTime === "" ) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (closingTime === null || closingTime === "" ) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (openingTime >= closingTime) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
    } else {

      try {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          const uid = user.uid;
          let ppecRef = await addDoc(collection(db, "PPEC"), {
            CNA: 0,
            LPN: 0,
            RN: 0,
            admin: uid,
            centerName: centerName,
            centerAdressName: centerAddress,
            clients: 0,
            closeTime: closingTime,
            openTime: openingTime,
            opertionalDays: selectedDays,
            complient: false,
            country: "United States",
            location: geoLocation,
            onSiteRN: 0,
            onSiteCNA: 0,
            onSiteLPN: 0,
            radius: centerRadius,
            city: centerCity,
            state: centerState,
            zipCode: centerZip,
          });

          await setDoc(doc(db, "PPEC", ppecRef.id, "history", getTodayDateRepresentation()), {
            CNA: 0,
            LPN: 0,
            RN: 0,
            admin: uid,
            centerName: centerName,
            centerAdressName: centerAddress,
            clients: 0,
            closeTime: closingTime,
            openTime: openingTime,
            opertionalDays: selectedDays,
            complient: false,
            country: "United States",
            location: geoLocation,
            onSiteRN: 0,
            onSiteCNA: 0,
            onSiteLPN: 0,
            radius: centerRadius,
            city: centerCity,
            state: centerState,
            zipCode: centerZip,
            staffTracking: [],
            ClientsChanges: [],
            ComplianceUpdate: [],
          });
        } else {
          // User is signed out
          // ...
        }
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setCenterName("");
        setDaysOfWeek({
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        });
        setSelectedDays([]);
        setOpeningTime("");
        setClosingTime("");
        window.location.reload();
      }, 2000);
      } catch (error) {
        
      }

      
    }
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
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll"
          onClick={() => setIsOpen(false)}
        >
          <form
            className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-2/3 mt-96 mb-20"
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
            <p id='err-name' className='text-left text-sm text-red-600 hidden'>* Center Name is required</p>
            
              <LocationPicker />
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
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (event.target.checked) {
                      setSelectedDays([...selectedDays, value])
                    } else {
                      setSelectedDays(selectedDays.filter((day) => day !== value));
                    }
                  }}
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
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
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
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
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
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
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
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
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

                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
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
                  
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (event.target.checked) {
                        setSelectedDays([...selectedDays, value]);
                      } else {
                        setSelectedDays(selectedDays.filter((day) => day !== value));
                      }
                    }}
                  />
                  <span className="ml-2 text-gray-700">Saturday</span>
                </label>
                </div>
                <p id='err-days' className='text-left text-sm text-red-600 hidden'>* Select atleast one day</p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center space-x-4 my-4">
                <label htmlFor="opening-time" className="text-gray-700">
                  Opening Time
                </label>
                <TimePicker
                  placeholder="Select Time"
                  use12Hours
                  showSecond={false}
                  focusOnOpen={true}
                  value={openingTime ? moment(openingTime, 'HH:mm') : null}
                  onChange={(value) => setOpeningTime(value.format('HH:mm'))}
                />
                {/* <input
                  type="time"
                  id="opening-time"
                  name="openingTime"
                  value={openingTime}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setOpeningTime(event.target.value)}
                /> */}
                <label htmlFor="closing-time" className="text-gray-700 sm:!mt-2">
                  Closing Time
                </label>
                <TimePicker
                  placeholder="Select Time"
                  use12Hours
                  showSecond={false}
                  focusOnOpen={true}
                  value={closingTime ? moment(closingTime, 'HH:mm') : null}
                  onChange={(value) => setClosingTime(value.format('HH:mm'))}
                />
                {/* <input
                  type="time"
                  id="closing-time"
                  name="closingTime"
                  value={closingTime}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setClosingTime(event.target.value)}
                /> */}
              </div>
              <p id='err-time' className='text-sm text-red-600 text-center hidden'>* Invalid Opening / Closing Time</p>
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
