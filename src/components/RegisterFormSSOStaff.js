import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../firebase.js";
import {  doc, setDoc  } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


function RegFormStaffSSO() {

  const [staffNum, setStaffNum] = useState("");
  const [staffJob, setStaffJob] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState('');

  let navigate = useNavigate();

  const handlePhotoInput = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const auth = getAuth();

  const submit = async (e) => {
    e.preventDefault();

    var regex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;

    if ( staffNum === null || staffNum === "" || !staffNum.match(regex) || staffJob === null || staffJob === "") {
      if (staffNum === null || staffNum === "" || !staffNum.match(regex)) {
        document.getElementById("err-num-reg").classList.remove("hidden");
      } else {
        document.getElementById("err-num-reg").classList.add("hidden");
      }
      if (staffJob === null || staffJob === "" ) {
        document.getElementById("err-job").classList.remove("hidden");
      } else {
        document.getElementById("err-job").classList.add("hidden");
      }
    } else {

      

      onAuthStateChanged(auth, async(user) => {
        if (user) {
          try {
            // Upload file to Firebase Storage
            const storage = getStorage();
            const storageRef = ref(storage, `images/${user.email}/${selectedPhoto.name}`);
            await uploadBytes(storageRef, selectedPhoto);
            
            // Get download URL of file
            const downloadUrl = await getDownloadURL(storageRef);
            setPhotoUrl(downloadUrl);

            await setDoc(doc(db, "users", user.uid), {
              firstname: user.displayName,
              lastname: "",
              email: user.email,
              phoneNum: Number(staffNum),
              jobTitle: staffJob,
              isAdmin: false,
              photoUrl: downloadUrl,
              uid: user.uid,
            });
            
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
      });

      setStaffNum("");
      setStaffJob("");
      
      navigate("/Home");
    }

    
  };

  return (

<main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
  <section className="flex w-[30rem] flex-col space-y-10 mt-[68px] scale-75">
    <div className="text-center text-[2rem] font-medium">Create an Adminstrator Account</div>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Phone Number"
        className="w-full px-4 py-2 phone border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffNum}
        onChange={(e) => setStaffNum(e.target.value)}
        required
      />
    </div>
    <p id='err-num-reg' className='!mt-2 text-left text-red-600 hidden'>* Invalid Phone Number</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <div className="relative w-full">
        <select
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
    </div>
    <p id='err-job' className='!mt-2 text-left text-red-600 hidden'>* Job Title is required</p>

    <div className="w-full flex flex-col justify-start transform border-b-2 bg-transparent cursor-pointer text-lg duration-300 focus-within:border-indigo-500">
      <label
        className="w-full px-4 py-2 text-left border-none bg-transparent outline-none cursor-pointer text-slate-400 italic"
        htmlFor="upload"
      >
        Upload Profile Photo (Optional)
      </label>
      <input
        id="upload"
        type="file"
        className="transform rounded-sm bg-transparent cursor-pointer px-4 py-2 font-bold"
        onChange={handlePhotoInput}
      />
      {/* {photoUrl && <img src={photoUrl} alt="Uploaded file" />} */}
    </div>

    <button
      type='submit'
      className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
      onClick={submit}
    >
      Continue
    </button>

    {/* <p className="text-center text-lg !mt-4">
      Already have an account?
      <span className="font-medium text-indigo-500 underline-offset-4 hover:underline cursor-pointer"> <Link to="/">Sign In</Link> </span>
    </p> */}
  </section>
</main>
  );
}

export default RegFormStaffSSO;