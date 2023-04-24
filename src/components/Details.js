import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDocs, collection } from "firebase/firestore";

function Details(props) {


  const [centerName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [clients, setClients] = useState("");
  const [onSiteRN, setOnSiteRN] = useState("");
  const [onSiteLPN, setOnSiteLPN] = useState("");
  const [onSiteCNA, setOnSiteCNA] = useState("");
  const [compliance, setCompliance] = useState("");
  


  async function ppecData() {
    
    const querySnapshot = await getDocs(collection(db, "PPEC"));
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.id === props.id) {
        setCenterName(doc.data().centerName);
        setCenterAddress(doc.data().centerAdressName);
        setClients(doc.data().clients)
        setOnSiteRN(doc.data().onSiteRN)
        setOnSiteLPN(doc.data().onSiteLPN)
        setOnSiteCNA(doc.data().onSiteCNA)
        if (doc.data().complient === false) {
          setCompliance("Site Non-Compliant");
        } else {
          setCompliance("Site Compliant");
        }
      }
  
  
    });

  }

  console.log(compliance)
  ppecData()


  return (
    <>
      <div className='mt-5'>
        <h1 className="text-4xl font-bold text-gray-800">{centerName}</h1>
        <p className="text-gray-600 mt-2">{centerAddress}</p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{clients}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Clients On Site</p>
        </div>
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">0</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff Required</p>
        </div>
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">0</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff On Site</p>
        </div>

      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">0</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">RN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">0</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">LPN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">0</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">CNA(s) Required</p>
        </div>

        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteRN}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">RN(s) On Site</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteLPN}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">LPN(s) On Site</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteCNA}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">CNA(s) On Site</p>
        </div>

      </div>

      <div className='m-9'>
        <h1 className="text-4xl font-bold text-gray-800">COMPLIANCE STATUS</h1>
        <div className=" bg-red-600 border-gray-800 border-4 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between my-5">
          <h4 className=" text-2xl font-bold text-gray-800 my-10">{compliance}</h4>
        </div>
      </div>

    </>

  );
}

export default Details;