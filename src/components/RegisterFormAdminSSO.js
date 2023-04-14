import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";


function RegFormAdminSSO() {

  const [adminNum, setAdminNum] = useState("");
  const [adminJob, setAdminJob] = useState("");

  const auth = getAuth();

  const submit = async (e) => {
    e.preventDefault();

    var regex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;

    if ( adminNum === null || adminNum === "" || !adminNum.match(regex) || adminJob === null || adminJob === "") {
      if (adminNum === null || adminNum === "" || !adminNum.match(regex)) {
        document.getElementById("err-num-reg").classList.remove("hidden");
      } else {
        document.getElementById("err-num-reg").classList.add("hidden");
      }
      if (adminJob === null || adminJob === "" ) {
        document.getElementById("err-job").classList.remove("hidden");
      } else {
        document.getElementById("err-job").classList.add("hidden");
      }
    } else {

      onAuthStateChanged(auth, async(user) => {
        if (user) {
          try {
            await setDoc(doc(db, "users", user.uid), {
              displayName: user.displayName,
              email: user.email,
              phoneNum: Number(adminNum),
              jobTitle: adminJob,
              isAdmin: true,
              uid: user.uid,
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
      });

      setAdminNum("");
      setAdminJob("");
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
        value={adminNum}
        onChange={(e) => setAdminNum(e.target.value)}
        required
      />
    </div>
    <p id='err-num-reg' className='!mt-2 text-left text-red-600 hidden'>* Invalid Phone Number</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Job Title"
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={adminJob}
        onChange={(e) => setAdminJob(e.target.value)}
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

export default RegFormAdminSSO;