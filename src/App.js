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
import RegisterApplePage from './Pages/RegisterApplePage';
import RegisterAppleAdmin from './Pages/RegisterAppleAdminPage';
import RegisterAppleStaff from './Pages/RegisterAppleStaffPage';
import PPECDetails from './Pages/PPECDetails';
import StaffDetails from './Pages/StaffDetails';

import { Routes, Route} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import History from './Pages/history';
import DateHistory from './Pages/DateHistory';

function App() {

  const [isLogged, setIsLogged] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
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
      setIsLoading(false); // Firebase response loaded successfully, stop timer
    } else {
      setIsLogged(false);
      setIsLoading(false); // Firebase response loaded successfully, stop timer
    }
  });

  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 100000); // set a timeout of 2 seconds to simulate page loading

}, []);

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-900 overflow-y-hidden">
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
          <Route path='/register-apple' element={<RegisterApplePage/>}/>
          <Route path='/register-apple/admin' element={<RegisterAppleAdmin/>}/>
          <Route path='/register-apple/staff' element={<RegisterAppleStaff/>}/>
          <Route path={`/:ppecID`} element={<><Navbar/><PPECDetails/></>}/>
          <Route path='/:ppecID/history' element={<><Navbar/><History/></>}/>
          <Route path='/:ppecID/history/:Date' element={<><Navbar/><DateHistory/></>}/>
          <Route path='/:ppecID/staff' element={<><Navbar/><StaffDetails/></>}/>
        </Routes>
    </div>
  );
}

export default App;
