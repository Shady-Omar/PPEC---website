import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

function PpecCenterContainer() {

  const [documents, setDocuments] = useState([]);
  const [DocumentsID, setDocumentsID] = useState([]);

  

  useEffect(()=>{

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        async function getAllDocuments() {
          const q = query(collection(db, "PPEC"), where("admin", "==", uid));
          const querySnapshot = await getDocs(q);
          const documentsData = querySnapshot.docs.map((doc) => doc.data());
          const documentsID = querySnapshot.docs.map((doc) => doc.id);
          setDocuments(documentsData);
          setDocumentsID(documentsID);
        }
    
        getAllDocuments();

      } else {
        // User is signed out
        // ...
      }
    }, []);

  }, [])

  



  return (
    <>
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
      {documents.map((document, index) => (

      <div key={index} className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800 mt-4">{document.centerName}</h4>
        <p className="mt-2 text-sm text-gray-600">{document.centerAdressName}</p>
        <Link to={`/${DocumentsID[index]}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mt-4 mb-4">View Details</Link>
      </div>


      ))}
    </div>
    </>
  );
}

export default PpecCenterContainer;