import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, setDoc, getDocs, collection, query, deleteDoc } from "firebase/firestore"; 

function StaffContainer(props) {

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [DocumentsID, setDocumentsID] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffJob, setStaffJob] = useState('');
  const [staffClockIn, setClockInTime] = useState('');
  const [staffClockOut, setClockOutTime] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(()=>{
    async function getAllDocuments() {
      const q = query(collection(db, "PPEC", props.id, "staff"));
      const querySnapshot = await getDocs(q);
      const documentsData = querySnapshot.docs.map((doc) => doc.data());
      const documentsID = querySnapshot.docs.map((doc) => doc.id);
      setDocuments(documentsData);
      setDocumentsID(documentsID);
    }
    getAllDocuments()
  }, [])


  function getTodayDateRepresentation() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async function handleRemove(id) {
    if (window.confirm("Do you really want to delete this Staff ?")) {
      await deleteDoc(doc(db, "PPEC", props.id, "staff", id)).then()
      window.location.replace(`/${props.id}`)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (staffName === null || staffName === "" || staffEmail === null || staffEmail === "" || staffJob === null || staffJob === "" || staffClockIn === null || staffClockIn === "" || staffClockOut === null || staffClockOut === "" || staffClockIn >= staffClockOut) {
      if (staffName === null || staffName === "") {
        document.getElementById("err-name").classList.remove("hidden");
      } else {
        document.getElementById("err-name").classList.add("hidden");
      }
      if (staffEmail === null || staffEmail === "") {
        document.getElementById("err-email").classList.remove("hidden");
      } else {
        document.getElementById("err-email").classList.add("hidden");
      }
      if (staffJob === null || staffJob === "") {
        document.getElementById("err-job").classList.remove("hidden");
      } else {
        document.getElementById("err-job").classList.add("hidden");
      }
      if (staffClockIn === null || staffClockIn === "") {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (staffClockOut === null || staffClockOut === "") {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
      if (staffClockIn >= staffClockOut) {
        document.getElementById("err-time").classList.remove("hidden");
      } else {
        document.getElementById("err-time").classList.add("hidden");
      }
    } else {
      try {
        
        const userRef = doc(db, "PPEC", props.id, "staff", selectedUser.staffId);
        await setDoc(userRef, {
          firstName: staffName,
          email: staffEmail,
          jobTitle: staffJob,
          clockIn: staffClockIn,
          clockOut: staffClockOut,
          staffId:selectedUser.staffId,
        });

        const historyRef = doc(db, "PPEC", props.id, "history", getTodayDateRepresentation(), "staff", selectedUser.staffId);
        await setDoc(historyRef, {
          firstName: staffName,
          email: staffEmail,
          jobTitle: staffJob,
          clockIn: staffClockIn,
          clockOut: staffClockOut,
          staffId:selectedUser.staffId,
        });

        setIsSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          window.location.reload();
        }, 2000);
      } catch (error) {

      }
    }
    }

  return (
    <>
      <h1 className=" text-4xl font-bold text-gray-800 my-8">Staff Members</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        {documents.map((document, index) => (

        <div key={index} className="bg-gray-200 max-h-[300px] cursor-pointer rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800 mt-4">{document.firstName}</h4>
          <p className="mb-4 mt-2 text-sm text-gray-600">{document.email}</p>
          <div className='w-full flex flex-row justify-evenly items-center'>
          <button onClick={() => {
            setSelectedStaff(document);
            setIsOpen(true);
            setSelectedUser(document);
            setStaffName(document.firstName);
            setStaffEmail(document.email);
            setStaffJob(document.jobTitle);
            setClockInTime(document.clockIn);
            setClockOutTime(document.clockOut);
          }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mb-4">
            Edit
          </button>
            <button onClick={() => handleRemove(document.staffId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mb-4">Delete</button>
          </div>
          {isOpen && selectedStaff === document && (
            <div
              id={`form-container-${index}`}
              className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll"
              onClick={() => setIsOpen(false)}
            >
              <form
                className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-2/3"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Staff Information</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold" htmlFor="staff-email">
                    Name:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline my-4"
                    type="text"
                    name="name"
                    defaultValue={selectedUser ? selectedUser.firstName : ''}
                    onChange={(event) => setStaffName(event.target.value)}
                    placeholder="Name"
                    required
                  />
                  <p id='err-name' className='text-left text-sm text-red-600 hidden'>* Staff Name is required</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold" htmlFor="staff-email">
                    Email Address:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline my-4"
                    id="email"
                    type="text"
                    name="email"
                    defaultValue={selectedUser ? selectedUser.email : ''}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                  <p id='err-email' className='text-left text-sm text-red-600 hidden'>* Staff email address is required</p>
                </div>
                <label className="block text-gray-700 font-bold" htmlFor="staff-email">
                    Job Title:
                  </label>
                <div className="relative w-full border-gray-400 border-2 rounded-lg mt-2">
                  <select
                    id='select'
                    className="block text-slate-400 italic w-full h-10 px-4 py-2 pr-8 leading-tight bg-transparent border-none appearance-none focus:outline-none"
                    defaultValue={selectedUser ? selectedUser.jobTitle : ''}
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
                  <p id='err-job' className='text-left text-sm text-red-600 hidden'>* Staff Job is required</p>
                <div className="flex flex-col md:flex-row justify-center items-center space-x-4 my-4 w-full">
                <label htmlFor="clockin-time" className="text-gray-700">
                  Clock In Time
                </label>
                <input
                  type="time"
                  id="clockin-time"
                  name="clockinTime"
                  defaultValue={selectedUser ? selectedUser.clockIn : ''}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(e) => setClockInTime(e.target.value)}
                />
                <label htmlFor="closing-time" className="text-gray-700">
                  Clock Out Time
                </label>
                <input
                  type="time"
                  id="closing-time"
                  name="closingTime"
                  defaultValue={selectedUser ? selectedUser.clockOut : ''}
                  className="shadow appearance-none border rounded w-3/4 lg:w-1/5 mb-4 py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
                  onChange={(e) => setClockOutTime(e.target.value)}
                />
              </div>
              <p id='err-time' className='w-full text-sm text-red-600 text-center hidden'>* Invalid Opening / Closing Time</p>
          
                <div className="flex items-center justify-between">
                  
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
          
                  <button
                    id='submit-btn'
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
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

))}
      </div>
    </>
  );
}

export default StaffContainer;