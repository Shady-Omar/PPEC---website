import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js";

function LogForm() {

  const [logEmail, setLogEmail] = useState("");
  const [logPass, setLogPass] = useState("");
  
  let navigate = useNavigate();
  const auth = getAuth();

  const signWithFacebook = async (e) => {
    e.preventDefault();

    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
    .then(async(result) => {
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      console.log(accessToken);

      // IdP data available using getAdditionalUserInfo(result)
      // ...

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate("/Home");
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        navigate("/SSO/register");
      }

      
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      const email = error.customData.email;
      console.log(email);
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(credential);

      // ...
    });

  }
  
  
  const signWithGoogle = async (e) => {
    e.preventDefault();
    
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then(async(result) => {

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token)
      // The signed-in user info.
      const user = result.user;
      console.log(user)
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate("/Home");
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        navigate("/SSO/register");
      }


    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode)
      const errorMessage = error.message;
      console.log(errorMessage)
      // The email of the user's account used.
      const email = error.customData.email;
      console.log(email)
      
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(credential)
      // ...
    });

  }

  const submit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, logEmail, logPass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      // ...
      setLogEmail("");
      setLogPass("");
      document.getElementById("err-log").classList.add("hidden");
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      document.getElementById("err-log").classList.remove("hidden");
    });


  }

  return (

<main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
  <section className="flex w-[30rem] flex-col space-y-10 mt-[68px] scale-90">
    <div className="text-center text-4xl font-medium">Log In</div>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="text"
        placeholder="Email Address"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={logEmail}
        onChange={(e) => setLogEmail(e.target.value)}
        required
      />
    </div>

    <div
      className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500"
    >
      <input
        type="password"
        placeholder="Password"
        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
        value={logPass}
        onChange={(e) => setLogPass(e.target.value)}
        required
      />
    </div>
    <p id='err-log' className='!mt-2 text-left text-red-600 hidden'>* Invalid email or password. Please try again.</p>

    <button
      className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
      onClick={submit}
    >
      Sign in
    </button>
    <button
      className="transform rounded-sm bg-[#3B5998] py-2 font-bold duration-300 hover:bg-[#8B9DC3] !mt-4"
      onClick={signWithFacebook}
    >
      Sign in with Facebook
    </button>
    <button
      className="transform rounded-sm bg-[#BB001B] py-2 font-bold duration-300 hover:bg-[#EA4335] !mt-4"
      onClick={signWithGoogle}
    >
      Sign in with Google
    </button>
    <button
      className="transform rounded-sm bg-[#D4D4D2] text-[#1C1C1C] py-2 font-bold duration-300 hover:bg-[#1C1C1C] hover:text-[#D4D4D2] !mt-4"
    >
      Sign in with Apple ID
    </button>

    <p className="text-center text-lg !mt-6">
      Don't have an account?
      <span className="font-medium text-indigo-500 underline-offset-4 hover:underline cursor-pointer"> <Link to="/register">Create One</Link> </span>
    </p>
  </section>
</main>
  );
}

export default LogForm;