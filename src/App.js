// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import HomeStaff from './Pages/HomeStaff';
import RegisterPage from './Pages/RegisterPage';
import RegisterAdmin from './Pages/RegisterAdminPage';
import RegisterStaff from './Pages/RegisterStaffPage';
import RegisterSSO from './Pages/RegisterSSOPage';
import RegisterSSOAdmin from './Pages/RegisterSSOAdminPage';
import RegisterSSOStaff from './Pages/RegisterSSOStaffPage';
import PPECDetails from './Pages/PPECDetails';

import { Routes, Route} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true)


  useEffect(()=>{

    // Check if user is already signed in
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is already signed in, navigate to home page
        
        setIsLogged(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isAdmin === true) {
          setIsAdmin(true);
          // window.location.replace("/");
        } else if (docSnap.exists() && docSnap.data().isAdmin === false) {
          // window.location.replace("/");
          setIsAdmin(false);
        }
      } else {
        setIsLogged(false);
      }
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // set a timeout of 2 seconds to simulate page loading

    return () => clearTimeout(timer);


  }, [])

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <div className="flex items-center justify-center scale-[2]">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-white" />
            </div>
          </div>;
  }

  return (
    <div className="App">
        <Routes>
          {isLogged && 
            <>
              {isAdmin ? (
                <Route path="/" element={<><Navbar /><HomePage/></>} />
              ) : (
                <Route path="/" element={<><Navbar /><HomeStaff/></>} />
              )}
            </>
          }
          {!isLogged && <Route path="/" element={<LoginPage/>}/>}
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/register/admin' element={<RegisterAdmin/>}/>
          <Route path='/register/staff' element={<RegisterStaff/>}/>
          <Route path='/register-SSO' element={<RegisterSSO/>}/>
          <Route path='/register-SSO/admin' element={<RegisterSSOAdmin/>}/>
          <Route path='/register-SSO/staff' element={<RegisterSSOStaff/>}/>
          <Route path={`/:ppecID`} element={<><Navbar/><PPECDetails/></>}/>
        </Routes>
    </div>
  );
}

export default App;
