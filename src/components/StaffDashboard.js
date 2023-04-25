import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

function StaffDashboard() {

  const [documents, setDocuments] = useState([]);
  const [staffJobTitle, setStaffJobTitle] = useState([]);
  const [staffClockIn, setStaffClockIn] = useState([]);
  const [staffClockOut, setStaffClockOut] = useState([]);
  const [PPECArray, setPPECArray] = useState([]);

  

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const documents = []; // Fix 1: Define and initialize documents as an empty array
        const staffJobTitle = []; 
        const staffClockIn = [];
        const staffClockOut = [];
        async function getAllDocuments() {
          const q = query(collection(db, "users"), where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          // const documentsID = querySnapshot.docs.map((doc) => doc.id);
          const ppecArray = querySnapshot.docs.map((doc) => doc.data().PPEC);
          setPPECArray(ppecArray[0]);
          const querySnapshotx = await getDocs(collection(db, "PPEC")); // Fix 2: Move this outside of the loop
          for (let i = 0; i < ppecArray[0].length; i++) {
            querySnapshotx.forEach((doc) => {
              if (doc.id === ppecArray[0][i]) {
                documents.push(doc.data());
              }
              
            });
          }
          setDocuments(documents); // Fix 1: Update the documents state with the retrieved data
          for (let i = 0; i < ppecArray[0].length; i++) {
            const q2 = query(collection(db, "PPEC", ppecArray[0][i], "staff"), where("staffId", "==", uid));
            const querySnapshot2 = await getDocs(q2);
            const staffJob = querySnapshot2.docs.map((doc) => doc.data().jobTitle);
            const ClockIn = querySnapshot2.docs.map((doc) => doc.data().clockIn);
            const ClockOut = querySnapshot2.docs.map((doc) => doc.data().clockOut);
            staffJobTitle.push(staffJob[0]);
            staffClockIn.push(ClockIn[0]);
            staffClockOut.push(ClockOut[0]);
          }
          setStaffJobTitle(staffJobTitle);
          setStaffClockIn(staffClockIn);
          setStaffClockOut(staffClockOut);
        }
        getAllDocuments();
      } else {
        // User is signed out
        // ...
      }
    }, []);
  }, []);

  return (
    <>
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
      {documents.map((document, index) => (

      <div key={index} className="bg-gray-200 max-h-[300px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
        <h4 className="text-xl font-bold text-gray-800 mt-4">{document.centerName}</h4>
        <p className="mt-2 text-sm text-gray-600">{document.centerAdressName}</p>
        <div className='mb-4 mt-2'>
          <p className="mt-2 text-lg font-semibold text-gray-700">Job Title: {staffJobTitle[index]}</p>
          <p className="mt-2 text-lg font-semibold text-gray-700">Clock In: {staffClockIn[index]}</p>
          <p className="mt-2 text-lg font-semibold text-gray-700">Clock Out: {staffClockOut[index]}</p>
        </div>
      </div>


      ))}
    </div>
    </>
  );
}

export default StaffDashboard;