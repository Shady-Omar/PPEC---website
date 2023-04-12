import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


function RegFormStaff() {

  const [staffFirst, setStaffFirst] = useState("");
  const [staffLast, setStaffLast] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [staffNum, setStaffNum] = useState("");
  const [staffJob, setStaffJob] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (staffFirst === null || staffFirst === "" || staffLast === null || staffLast === "" || staffEmail === null || staffEmail === "" || staffPass === null || staffPass === "" || staffPass.length < 6 || staffNum === null || staffNum === "" || staffJob === null || staffJob === "") {
      if (staffFirst === null || staffFirst === "" ) {
        document.getElementById("err-first").classList.remove("hidden");
      } else {
        document.getElementById("err-first").classList.add("hidden");
      }
      if (staffLast === null || staffLast === "" ) {
        document.getElementById("err-last").classList.remove("hidden");
      } else {
        document.getElementById("err-last").classList.add("hidden");
      }
      if (staffEmail === null || staffEmail === "" ) {
        document.getElementById("err-email").classList.remove("hidden");
      } else {
        document.getElementById("err-email").classList.add("hidden");
      }
      if (staffPass === null || staffPass === "" ) {
        document.getElementById("err-pass").classList.remove("hidden");
      } else {
        document.getElementById("err-pass").classList.add("hidden");
      }
      if (staffPass.length < 6) {
        document.getElementById("err-pass-length").classList.remove("hidden");
      } else {
        document.getElementById("err-pass-length").classList.add("hidden");
      }
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
      
      try {
        const docRef = await addDoc(collection(db, "users"), {
          displayName: {staffFirst, staffLast},
          email: staffEmail,
          phoneNum: staffNum,
          jobTitle: staffJob,
          isAdmin: false,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, staffEmail, staffPass);

      setStaffFirst("");
      setStaffLast("");
      setStaffEmail("");
      setStaffPass("");
      setStaffNum("");
      setStaffJob("");
      
    }

  };

  return (

<main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
  <section className="flex w-[30rem] flex-col space-y-10 mt-10 scale-75">
    <div className="text-center text-4xl font-medium">Create a Staff Account</div>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="First Name"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffFirst}
        onChange={(e) => setStaffFirst(e.target.value)}
      />
    </div>
    <p id='err-first' className='!mt-2 text-left text-red-600 hidden'>* First name is required</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Last Name"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffLast}
        onChange={(e) => setStaffLast(e.target.value)}
      />
    </div>
    <p id='err-last' className='!mt-2 text-left text-red-600 hidden'>* Last name is required</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Email Address"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffEmail}
        onChange={(e) => setStaffEmail(e.target.value)}
      />
    </div>
    <p id='err-email' className='!mt-2 text-left text-red-600 hidden'>* Email address is required</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="password"
        placeholder="Password"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffPass}
        onChange={(e) => setStaffPass(e.target.value)}
      />
    </div>
    <p id='err-pass' className='!mt-2 text-left text-red-600 hidden'>* Password is required</p>
    <p id='err-pass-length' className='!mt-2 text-left text-red-600 hidden'>* Password should be at least 6 characters</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="number"
        placeholder="Phone Number"
        className="w-full phone border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffNum}
        onChange={(e) => setStaffNum(e.target.value)}
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
      />
    </div>
    <p id='err-job' className='!mt-2 text-left text-red-600 hidden'>* Job Title is required</p>

    <button
      className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
      onClick={submit}
    >
      Sign up
    </button>

    <p className="text-center text-lg !mt-4">
      Already have an account?
      <span className="font-medium text-indigo-500 underline-offset-4 hover:underline cursor-pointer"> <Link to="/">Sign In</Link> </span>
    </p>
  </section>
</main>
  );
}

export default RegFormStaff;