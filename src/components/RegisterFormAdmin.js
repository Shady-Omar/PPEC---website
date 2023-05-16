import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../firebase.js";
import { doc, setDoc, getDocs, collection } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


async function getAllDataFromCollection() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const data = querySnapshot.docs.map((doc) => doc.data().email);
  return data;
}

function RegFormAdmin() {

  const [adminFirst, setAdminFirst] = useState("");
  const [adminLast, setAdminLast] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminNum, setAdminNum] = useState("");
  const [adminJob, setAdminJob] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState('');
  const [duplicateEmail, setDuplicateEmail] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllDataFromCollection();
      setDuplicateEmail(data);
    };
    fetchData();
  }, []);
  
  function duplicate(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === adminEmail) {
        return true;
      }
    }
    return false;
  }


  const auth = getAuth();


  const handlePhotoInput = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const submit = async (e) => {
    e.preventDefault();

    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var numRegex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/;

        if (adminFirst === null || adminFirst === "" || adminLast === null || adminLast === "" || !adminEmail.match(emailRegex) || duplicate(duplicateEmail) === true || adminPass === null || adminPass === "" || adminPass.length < 6 || !adminNum.match(numRegex) || adminJob === null || adminJob === "") {
          if (adminFirst === null || adminFirst === "" ) {
            document.getElementById("err-first").classList.remove("hidden");
          } else {
            document.getElementById("err-first").classList.add("hidden");
          }
          if (adminLast === null || adminLast === "" ) {
            document.getElementById("err-last").classList.remove("hidden");
          } else {
            document.getElementById("err-last").classList.add("hidden");
          }
          if (!adminEmail.match(emailRegex)) {
            document.getElementById("err-email").classList.remove("hidden");
          } else {
            document.getElementById("err-email").classList.add("hidden");
          }
          if (duplicate(duplicateEmail) === true) {
            // If the email is associated with an existing user account, redirect to the home page
            document.getElementById("err-email-exist").classList.remove("hidden");
          } else {
            // If the email is not associated with an existing user account, continue with the sign-in process
            document.getElementById("err-email-exist").classList.add("hidden");
          }
          if (adminPass === null || adminPass === "" || adminPass.length < 6) {
            document.getElementById("err-pass-length").classList.remove("hidden");
          } else {
            document.getElementById("err-pass-length").classList.add("hidden");
          }
          if (!adminNum.match(numRegex)) {
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
          createUserWithEmailAndPassword(auth, adminEmail, adminPass)
          .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            try {
    
              // Upload file to Firebase Storage
              const storage = getStorage();
              const storageRef = ref(storage, `images/${adminEmail}/${selectedPhoto.name}`);
              await uploadBytes(storageRef, selectedPhoto);
              
              // Get download URL of file
              const downloadUrl = await getDownloadURL(storageRef);
              setPhotoUrl(downloadUrl);
    
              await setDoc(doc(db, "users", user.uid), {
                firstname: adminFirst,
                lastname: adminLast,
                email: adminEmail.toLowerCase(),
                phoneNum: `${Number(adminNum)}`,
                jobTitle: adminJob,
                isAdmin: true,
                photoUrl: downloadUrl,
                uid: user.uid,
                PPEC: [],
                NotificationChannels: { email: false, "in-app-notifications": true, sms: false },
                NotificationFrequency: { "daily-summaries": false, "real-time-alerts": true, "weekly-overviews": false },
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
        
          setAdminFirst("");
          setAdminLast("");
          setAdminEmail("");
          setAdminPass("");
          setAdminNum("");
          setAdminJob("");
    
          window.location.href('/');
        }
  };

  return (

<main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
  <section className="flex w-[30rem] flex-col space-y-10  scale-75">
    <div className="text-center text-[2rem] font-medium">Create an Adminstrator Account</div>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="First Name"
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={adminFirst}
        onChange={(e) => setAdminFirst(e.target.value)}
        required
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
        value={adminLast}
        onChange={(e) => setAdminLast(e.target.value)}
        required
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
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        required
      />
    </div>
    <p id='err-email' className='!mt-2 text-left text-red-600 hidden'>* Email address is required</p>
    <p id='err-email-exist' className='!mt-2 text-left text-red-600 hidden'>* Email address already exists</p>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={adminPass}
        onChange={(e) => setAdminPass(e.target.value)}
        required
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

export default RegFormAdmin;