import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDocs, collection, query } from "firebase/firestore";
import { Link } from 'react-router-dom';

function HistoryDetails(props) {

  const [documents, setDocuments] = useState([]);

  useEffect(()=>{

        async function getAllDocuments() {
          const q = query(collection(db, "PPEC", props.id, "history"));
          const querySnapshot = await getDocs(q);
          const documentsData = querySnapshot.docs.map((doc) => doc.id);
          setDocuments(documentsData);
        }
        getAllDocuments();

  }, [])


  return (
    <>
    <h1 className=" text-4xl font-bold text-gray-800 my-8">Changes History</h1>
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
      {documents.map((document, index) => (

      <div key={index} className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4 p-4 cursor-pointer">
        <h4 className="text-lg font-bold text-gray-800">{document}</h4>
        <Link to={`/${props.id}/history/${document}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mt-4">View</Link>
      </div>


      ))}
    </div>
    </>
  );

}

export default HistoryDetails;