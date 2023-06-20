import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../firebase.js";
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



function RegFormAdminSSO() {

  const [adminNum, setAdminNum] = useState("");
  const [adminJob, setAdminJob] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState('');
  
  let navigate = useNavigate();

  const handlePhotoInput = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const auth = getAuth();

  const submit = async (e) => {
    e.preventDefault();

    var numRegex = /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/

    if (!adminNum.match(numRegex) || adminJob === null || adminJob === "") {
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
              email: user.email.toLowerCase(),
              phoneNum: `${Number(adminNum)}`,
              jobTitle: adminJob,
              isAdmin: true,
              photoUrl: downloadUrl,
              uid: user.uid,
              PPEC: [],
              NotificationChannels: { email: false, "in-app-notifications": true, sms: false },
              NotificationFrequency: { "daily-summaries": false, "real-time-alerts": true, "weekly-overviews": false },
            });
            setAdminNum("");
            setAdminJob("");
            
           window.location.href = '/';
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
      });

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
      Continue
    </button>
  </section>
</main>
  );
}

export default RegFormAdminSSO;