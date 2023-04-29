import React, { useState } from 'react';
import { db } from "../firebase.js";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
import StaffForm from './StaffForm.js';

function Details(props) {


  const [centerName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [clients, setClients] = useState("");
  const [clientsChange, setClientsChange] = useState("");
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
        let statusColor = document.getElementById('status');
        if (doc.data().complient === false) {
          setCompliance("Site Non-Compliant");
          statusColor.classList.add('bg-red-600');
        } else {
          setCompliance("Site Compliant");
          statusColor.classList.add('bg-green-600');
        }
      }
  
  
    });

  }

  ppecData()

  let requiredRN = Math.ceil(clients / 5);
  let requiredLPN = clients > 2 ? Math.ceil((clients - 2)/3) : 0;
  let requiredCNA = Math.ceil(clients / 2);

  async function handleSubmit(event) {
    event.preventDefault();

    const PPECRef = doc(db, "PPEC", props.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(PPECRef, {
      clients: clientsChange,
    });
    setClientsChange("")

  }

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
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{(requiredRN + requiredLPN + requiredCNA)}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff Required</p>
        </div>
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{(onSiteRN + onSiteLPN + onSiteCNA) || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff On Site</p>
        </div>

      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredRN || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">RN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredLPN || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">LPN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredCNA || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">CNA(s) Required</p>
        </div>

        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteRN || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">RN(s) On Site</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteLPN || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">LPN(s) On Site</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{onSiteCNA || 0}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">CNA(s) On Site</p>
        </div>

      </div>

      <div className='m-9'>
        <h1 className="text-4xl font-bold text-gray-800">COMPLIANCE STATUS</h1>
        <div id='status' className= "border-gray-800 border-4 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between my-5">
          <h4 className=" text-2xl font-bold text-gray-800 my-10">{compliance}</h4>
        </div>
      </div>

      <div className='m-9'>
        <div className="flex flex-row items-center justify-center my-5">
        <div
          className="transform border-b-2 border-gray-400 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
        >
          <input
            type="number"
            placeholder="Clients Number"
            className="px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            required
            value={clientsChange}
            onChange={(event) => setClientsChange(event.target.value)}
          />
        </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 mx-2"
            type="number"
            onClick={handleSubmit}
          >
            Change

          </button>
        </div>
      </div>

      <div className="relative m-8">
      <StaffForm myDocID={props.id}/>
      </div>

    </>

  );
}

export default Details;