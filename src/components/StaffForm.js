import React, { useState } from 'react';
import { db } from "../firebase.js";
import { collection, query, where, getDocs, setDoc, updateDoc, increment, arrayUnion, doc } from 'firebase/firestore';

function StaffForm(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffID, setStaffID] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffJob, setStaffJob] = useState('');
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');


  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const searchFirestoreCollection = async (e) => {
    e.preventDefault();
    const q = query(collection(db, 'users'), where('email', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().isAdmin === false) {
        results.push(doc.data());
      }
    });
    if (results.length === 0) {
      document.getElementById('err-search').classList.remove('hidden');
      document.getElementById('submit-btn').classList.add('hidden');
      document.getElementById('user-data').classList.add('hidden');
    } else {
      document.getElementById('err-search').classList.add('hidden')
      document.getElementById('submit-btn').classList.remove('hidden')
      document.getElementById('user-data').classList.remove('hidden')
      setStaffName(results[0].firstname + " " + (results[0].lastname || null));
      setStaffJob(results[0].jobTitle);
      setStaffID(results[0].uid);
    }
    console.log(results);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (clockInTime === '' || clockInTime === null || clockOutTime === '' || clockOutTime === null) {
      if (clockInTime === null || clockInTime === "" ) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (clockOutTime === null || clockOutTime === "" ) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (clockInTime >= clockOutTime) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
    } else {

      try {
        await setDoc(doc(db, "PPEC", props.myDocID, "staff", staffID), {
          clockIn: clockInTime,
          clockOut: clockOutTime,
          email: searchQuery,
          firstName: staffName,
          jobTitle: staffJob,
          staffId: staffID,
        });

        if (staffJob === "RN") {
          await updateDoc(doc(db, "PPEC", props.myDocID), {
            RN: increment(1)
          });
        } else if (staffJob === "LPN") {
          await updateDoc(doc(db, "PPEC", props.myDocID), {
            LPN: increment(1)
          });
        } else if (staffJob === "CNA") {
          await updateDoc(doc(db, "PPEC", props.myDocID), {
            CNA: increment(1)
          });
        }

        await updateDoc(doc(db, "users", staffID), {
          PPEC: arrayUnion(props.myDocID)
        });

        setIsSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          setSearchQuery("");
          setStaffJob("");
          setClockInTime("");
          setClockOutTime("");
          // window.location.reload();
        }, 2000);
      } catch (error) {
        console.log(error);
      }


    }

    }

  return (
    <div className="relative m-8">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        onClick={() => setIsOpen(true)}
      >
        Add Staff
      </button>

      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll"
          onClick={() => setIsOpen(false)}
        >
          <form
            className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-2/3"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Add Staff Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="staff-email">
                Staff Email Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline my-4"
                id="staff-email"
                type="text"
                placeholder="Search Staff Email Address"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
              <p id='err-search' className='text-left text-sm text-red-600 hidden'>* Staff Not Found</p>
              
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                onClick={searchFirestoreCollection}
              >
                Search
              </button>
            </div>

            <div id='user-data' className=' hidden flex items-start justify-between flex-col my-4'>
              <h4 className=' font-bold text-lg mb-2'>
                Name:
                <span className='font-normal'> {staffName}</span>
              </h4>
              <h4 className=' font-bold text-lg'>
                job Title:
              </h4>
              <div className="relative w-full border-gray-400 border-2 rounded-lg mt-2">
                <select
                  id='select'
                  className="block text-slate-400 italic w-full h-10 px-4 py-2 pr-8 leading-tight bg-transparent border-none appearance-none focus:outline-none"
                  value={staffJob}
                  onChange={(e) => setStaffJob(e.target.value)}
                  required
                >
                  <option className=' bg-transparent text-slate-400 cursor-pointer' value="" disabled defaultValue>Job Title</option>
                  <option className=' bg-transparent text-black hover:text-black cursor-pointer' value="RN">RN</option>
                  <option className=' bg-transparent text-black hover:text-black cursor-pointer' value="LPN">LPN</option>
                  <option className=' bg-transparent text-black hover:text-black cursor-pointer' value="CNA">CNA</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M0 0h20v20H0z" fill="none"/><path d="M6 8l4 4 4-4" /></svg>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center space-x-4 my-4 w-full">
                <label htmlFor="clockin-time" className="text-gray-700">
                  Clock In Time
                </label>
                <input
                  type="time"
                  id="clockin-time"
                  name="clockinTime"
                  value={clockInTime}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setClockInTime(event.target.value)}
                />
                <label htmlFor="closing-time" className="text-gray-700">
                  Clock Out Time
                </label>
                <input
                  type="time"
                  id="closing-time"
                  name="closingTime"
                  value={clockOutTime}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(event) => setClockOutTime(event.target.value)}
                />
              </div>
              <p id='err-time' className='w-full text-sm text-red-600 text-center hidden'>* Invalid Opening / Closing Time</p>
            </div>

            <div className="flex items-center justify-between">
              
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>

              <button
                id='submit-btn'
                className="hidden bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
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
            <p>New staff has been added.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffForm;
