import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";


function RegFormStaffSSO() {

  const [staffNum, setStaffNum] = useState("");
  const [staffJob, setStaffJob] = useState("");

  const auth = getAuth();

  const submit = async (e) => {
    e.preventDefault();

    if ( staffNum === null || staffNum === "" || staffJob === null || staffJob === "") {
      if (staffNum === null || staffNum === "" ) {
        document.getElementById("err-num").classList.remove("hidden");
      } else {
        document.getElementById("err-num").classList.add("hidden");
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
            const docRef = await addDoc(collection(db, "users"), {
              displayName: user.displayName,
              email: user.email,
              phoneNum: Number(staffNum),
              jobTitle: staffJob,
              isAdmin: false,
              uid: user.uid,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
      });

      setStaffNum("");
      setStaffJob("");
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
        type="number"
        placeholder="Phone Number"
        className="w-full phone border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffNum}
        onChange={(e) => setStaffNum(e.target.value)}
        required
      />
    </div>
    <p id='err-num' className='!mt-2 text-left text-red-600 hidden'>* Phone Number is required</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Job Title"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffJob}
        onChange={(e) => setStaffJob(e.target.value)}
        required
      />
    </div>
    <p id='err-job' className='!mt-2 text-left text-red-600 hidden'>* Job Title is required</p>

    <button
      type='submit'
      className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
      onClick={submit}
    >
      Continue
    </button>

    <p className="text-center text-lg !mt-4">
      Already have an account?
      <span className="font-medium text-indigo-500 underline-offset-4 hover:underline cursor-pointer"> <Link to="/">Sign In</Link> </span>
    </p>
  </section>
</main>
  );
}

export default RegFormStaffSSO;