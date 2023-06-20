import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, onSnapshot, setDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import StaffForm from './StaffForm.js';
import { Link } from 'react-router-dom'

function Details(props) {

  const [centerName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [clients, setClients] = useState("");
  const [clientsChange, setClientsChange] = useState("");
  const [RN, setRN] = useState("");
  const [LPN, setLPN] = useState("");
  const [CNA, setCNA] = useState("");
  const [onSiteRN, setOnSiteRN] = useState("");
  const [onSiteLPN, setOnSiteLPN] = useState("");
  const [onSiteCNA, setOnSiteCNA] = useState("");
  const [compliance, setCompliance] = useState("");
  const [complianceState, setComplianceState] = useState("");
  const [adminID, setAdminID] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [opDays, setOpDays] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [requiredRN, setRequiredRN] = useState("");
  const [requiredLPN, setRequiredLPN] = useState("");
  const [requiredCNA, setRequiredCNA] = useState("");
  
  
  
  function getTodayDateRepresentation() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }


  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${amOrPm}`;

    return timeString;
  }

  function getCompliance(
    onsiteRN,
    requiredRN,
    onsiteLPN,
    requiredLPN,
    onsiteCNA,
    requiredCNA
  ) {
    let min1 = Math.min(onsiteRN, requiredRN);
    onsiteRN -= min1;
    requiredRN -= min1;

    let min2 = Math.min(onsiteRN, requiredLPN);
    onsiteRN -= min2;
    requiredLPN -= min2;

    let min3 = Math.min(onsiteRN, requiredCNA);
    onsiteRN -= min3;
    requiredCNA -= min3;

    let min4 = Math.min(onsiteLPN, requiredLPN);
    onsiteLPN -= min4;
    requiredLPN -= min4;

    let min5 = Math.min(onsiteLPN, requiredCNA);
    onsiteLPN -= min5;
    requiredCNA -= min5;

    let min6 = Math.min(onsiteCNA, requiredCNA);
    onsiteCNA -= min6;
    requiredCNA -= min6;

    let sumRequired = requiredRN + requiredCNA + requiredLPN;

    return sumRequired === 0;
  }


  function getRnRequired(clients) {
    const sequence = [];
    for (let i = 1; i <= clients; i++) {
      for (let j = 0; j < 4; j++) {
        sequence.push(i);
      }
    }
    return sequence[clients - 1];
  }

  function getRnOrLPN(clients) {
    const sequence = [0, 0];
    for (let i = 1; i <= clients; i++) {
      for (let j = 0; j < 4; j++) {
        sequence.push(i);
      }
    }
    return sequence[clients - 1];
  }

  function getRnOrLPNOrCNA(clients) {
    const sequence = [0];
    for (let i = 1; i <= clients; i++) {
      for (let j = 0; j < 2; j++) {
        sequence.push(i);
      }
    }
    return sequence[clients - 1];
  }
  useEffect(() => {
  
    async function ppecData() {
      const docRef = doc(db, "PPEC", props.id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setCenterName(docSnap.data().centerName);
        setCenterAddress(docSnap.data().centerAdressName);
        setRN(docSnap.data().RN);
        setLPN(docSnap.data().LPN);
        setCNA(docSnap.data().CNA);
        setAdminID(docSnap.data().admin);
        setOpenTime(docSnap.data().openTime);
        setCloseTime(docSnap.data().closeTime);
        setOpDays(docSnap.data().opertionalDays);
        setGeoLocation(docSnap.data().location);
        setCity(docSnap.data().city);
        setState(docSnap.data().state);
        setZip(docSnap.data().zipCode);
      } else {
        console.log("No such document!");
      }
  
      const unsubscribe = onSnapshot(doc(db, "PPEC", props.id), (doc) => {
        if (doc.id === props.id) {
          setOnSiteRN(doc.data().onSiteRN || 0);
          setOnSiteLPN(doc.data().onSiteLPN || 0);
          setOnSiteCNA(doc.data().onSiteCNA || 0);
          setClients(doc.data().clients || 0);
        }
      });
      
  
      return unsubscribe;
    }
  
   
    
    ppecData().then((unsubscribe) => {
      let statusColor = document.getElementById("status");
      if (statusColor) {
      
        let complianceState = getCompliance(
          onSiteRN,
          getRnRequired(clients),
          onSiteLPN,
          getRnOrLPN(clients),
          onSiteCNA,
          getRnOrLPNOrCNA(clients)
        );
  
        if (clients === 0) {
          setCompliance("Site Compliant");
          statusColor.classList.remove("bg-red-600");
          statusColor.classList.add("bg-green-600");
        } else if (complianceState === false) {
          setCompliance("Site Non-Compliant");
          statusColor.classList.remove("bg-green-600");
          statusColor.classList.add("bg-red-600");
        } else if (complianceState === true) {
          setCompliance("Site Compliant");
          statusColor.classList.remove("bg-red-600");
          statusColor.classList.add("bg-green-600");
        }

        
      }

      setRequiredRN(getRnRequired(clients) || 0)
      setRequiredLPN(getRnOrLPN(clients) || 0)
      setRequiredCNA(getRnOrLPNOrCNA(clients) || 0)
  
      setComplianceState(() =>
        getCompliance(
          onSiteRN,
          getRnRequired(clients),
          onSiteLPN,
          getRnOrLPN(clients),
          onSiteCNA,
          getRnOrLPNOrCNA(clients)
        )
      );

      
      return unsubscribe;
    });
  }, [clients, onSiteRN, onSiteLPN, onSiteCNA]);
  

  async function handleDelete() {
    if (window.confirm("Do you really want to delete this center ?")) {
      await updateDoc(doc(db, "users", adminID), {
        PPEC: arrayRemove(props.id)
      })
      await deleteDoc(doc(db, "PPEC", props.id)).then()
      window.location.replace("/")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    

    if (clientsChange === "") {
      document.getElementById("err-change").classList.remove("hidden");
    } else {
      document.getElementById("err-change").classList.add("hidden");
      const PPECRef = doc(db, "PPEC", props.id);
      try {
        await updateDoc(PPECRef, {
          clients: Number(clientsChange),
          complient: getCompliance(
            onSiteRN,
            getRnRequired(clientsChange),
            onSiteLPN,
            getRnOrLPN(clientsChange),
            onSiteCNA,
            getRnOrLPNOrCNA(clientsChange)
          ),
        });
      } catch (error) {
        console.log(error);
      }

      const docRef = doc(db, "PPEC", props.id, "history", getTodayDateRepresentation());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        onSnapshot(doc(db, "PPEC", props.id),async (docx) => {
          if (docx.id === props.id) {
            setClients(docx.data().clients);
    
    
            const HistoryRef = doc(db, "PPEC", props.id, "history", getTodayDateRepresentation());
            await updateDoc(HistoryRef, {
              CNA: getRnOrLPNOrCNA(clientsChange),
              LPN:  getRnOrLPN(clientsChange),
              RN: getRnRequired(clientsChange),
              admin: adminID,
              centerName: centerName,
              centerAdressName: centerAddress,
              clients: clientsChange,
              closeTime: closeTime,
              openTime: openTime,
              opertionalDays: opDays,
              complient: getCompliance(
                onSiteRN,
                getRnRequired(clientsChange),
                onSiteLPN,
                getRnOrLPN(clientsChange),
                onSiteCNA,
                getRnOrLPNOrCNA(clientsChange)
              ),
              country: "United States",
              location: geoLocation,
              onSiteRN: onSiteRN || 0,
              onSiteCNA: onSiteCNA || 0,
              onSiteLPN: onSiteLPN || 0,
              radius: 200,
              city: city,
              state: state,
              zipCode: zip,
              ClientsChanges: arrayUnion(`${getCurrentTime()} ${clientsChange} clients present, ${Math.ceil(clientsChange / 5)} RN needed, ${Math.ceil(clientsChange / 2)} CNA needed, ${clientsChange > 2 ? Math.ceil((clientsChange - 2)/3) : 0} LPN needed`),
              ComplianceUpdate: [],
              staffTracking: [],
            });
          }
        });
      } else {
        
        await setDoc(doc(db, "PPEC", props.id, "history", getTodayDateRepresentation()), {
          CNA: getRnOrLPNOrCNA(clientsChange),
          LPN:  getRnOrLPN(clientsChange),
          RN: getRnRequired(clientsChange),
          admin: adminID,
          centerName: centerName,
          centerAdressName: centerAddress,
          clients: clientsChange,
          closeTime: closeTime,
          openTime: openTime,
          opertionalDays: opDays,
          complient: getCompliance(
            onSiteRN,
            getRnRequired(clientsChange),
            onSiteLPN,
            getRnOrLPN(clientsChange),
            onSiteCNA,
            getRnOrLPNOrCNA(clientsChange)
          ),
          country: "United States",
          location: geoLocation,
          onSiteRN: onSiteRN || 0,
          onSiteCNA: onSiteCNA || 0,
          onSiteLPN: onSiteLPN || 0,
          radius: 200,
          city: city,
          state: state,
          zipCode: zip,
          ClientsChanges: arrayUnion(`${getCurrentTime()} ${clientsChange} clients present, ${Math.ceil(clientsChange / 5)} RN needed, ${Math.ceil(clientsChange / 2)} CNA needed, ${clientsChange > 2 ? Math.ceil((clientsChange - 2)/3) : 0} LPN needed`),
          ComplianceUpdate: [],
          staffTracking: [],
        });

      }

      setClientsChange("")
    }
    

  }

  return (
    <>
      <div className='mt-5'>
        <h1 className="text-4xl font-bold text-gray-800">{centerName}</h1>
        <p className="text-gray-600 mt-2">{centerAddress}</p>
      </div>

      <div className='mt-8'>
        <Link to={`/${props.id}/history`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">history</Link>
      </div>
      <div className='mt-8'>
        <Link to={`/${props.id}/staff`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">show staff</Link>
      </div>


      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{clients}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Clients On Site</p>
        </div>
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{((requiredRN || 0) + (requiredLPN || 0) + (requiredCNA || 0))}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff Required</p>
        </div>
        <div>
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{((onSiteRN || 0) + (onSiteLPN || 0) + (onSiteCNA || 0))}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">Staff On Site</p>
        </div>

      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 m-9">
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredRN}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">RN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredLPN}</h4>
          <p className="mt-2 text-md font-semibold text-gray-600 mb-8">LPN(s) Required</p>
        </div>
        <div className="bg-gray-200 max-h-[164px] rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-between mb-4">
          <h4 className=" text-4xl font-bold text-gray-800 my-4">{requiredCNA}</h4>
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
            min={0}
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
        <p id='err-change' className='text-center text-sm text-red-600 hidden'>* This field can't be empty</p>
      </div>

      <div className="relative m-8">
      <StaffForm myDocID={props.id}/>
      </div>

      <div className='mb-8'>
        <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        onClick={handleDelete}
        >
          Delete Center
        </button>
      </div>

    </>

  );
}

export default Details;