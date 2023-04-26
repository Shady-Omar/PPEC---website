import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


function RegFormStaff() {

  const [staffFirst, setStaffFirst] = useState("");
  const [staffLast, setStaffLast] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [staffNum, setStaffNum] = useState("");
  const [staffJob, setStaffJob] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState('');

  let navigate = useNavigate();

  const handlePhotoInput = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const auth = getAuth();
  const email = staffEmail;

  const submit = async (e) => {
    e.preventDefault();

    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var numRegex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
      if (staffFirst === null || staffFirst === "" || staffLast === null || staffLast === "" || !staffEmail.match(emailRegex) || signInMethods.length > 0 || staffPass === null || staffPass === "" || staffPass.length < 6 || !staffNum.match(numRegex) || staffJob === null || staffJob === "") {
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
        if (!staffEmail.match(emailRegex)) {
          document.getElementById("err-email").classList.remove("hidden");
        } else {
          document.getElementById("err-email").classList.add("hidden");
        }
        if (signInMethods.length > 0) {
          // If the email is associated with an existing user account, redirect to the home page
          document.getElementById("err-email-exist").classList.remove("hidden");
        } else {
          // If the email is not associated with an existing user account, continue with the sign-in process
          document.getElementById("err-email-exist").classList.add("hidden");
        }
        if (staffPass === null || staffPass === "" || staffPass.length < 6) {
          document.getElementById("err-pass-length").classList.remove("hidden");
        } else {
          document.getElementById("err-pass-length").classList.add("hidden");
        }
        if (!staffNum.match(numRegex)) {
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
        
        

        
        createUserWithEmailAndPassword(auth, staffEmail, staffPass)
        .then(async(userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
          try {

            // Upload file to Firebase Storage
            const storage = getStorage();
            const storageRef = ref(storage, `images/${staffEmail}/${selectedPhoto.name}`);
            await uploadBytes(storageRef, selectedPhoto);
            
            // Get download URL of file
            const downloadUrl = await getDownloadURL(storageRef);
            setPhotoUrl(downloadUrl);

            await setDoc(doc(db, "users", user.uid), {
              firstname: staffFirst,
              lastname: staffLast,
              email: staffEmail,
              phoneNum: staffNum,
              jobTitle: staffJob,
              isAdmin: false,
              photoUrl: downloadUrl,
              uid: user.uid,
              PPEC: [],
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // ..
        });

        setStaffFirst("");
        setStaffLast("");
        setStaffEmail("");
        setStaffPass("");
        setStaffNum("");
        setStaffJob("");
        
        navigate("/");
      }
    })
    .catch((error) => {
      // Handle any errors here
    });

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
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
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
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
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
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffEmail}
        onChange={(e) => setStaffEmail(e.target.value)}
      />
    </div>
    <p id='err-email' className='!mt-2 text-left text-red-600 hidden'>* Invalid Email Address</p>
    <p id='err-email-exist' className='!mt-2 text-left text-red-600 hidden'>* Email address already exists</p>
    
    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffPass}
        onChange={(e) => setStaffPass(e.target.value)}
      />
    </div>
    <p id='err-pass-length' className='!mt-2 text-left text-red-600 hidden'>* Password should be at least 6 characters</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Phone Number"
        className="w-full px-4 py-2 phone border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={staffNum}
        onChange={(e) => setStaffNum(e.target.value)}
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