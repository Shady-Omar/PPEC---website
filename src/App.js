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
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {

  const [documents, setDocuments] = useState([]);
  const [DocumentsID, setDocumentsID] = useState([]);

  

  useEffect(()=>{

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        async function getAllDocuments() {
          const q = query(collection(db, "PPEC"), where("admin", "==", uid));
          const querySnapshot = await getDocs(q);
          const documentsData = querySnapshot.docs.map((doc) => doc.data());
          const documentsID = querySnapshot.docs.map((doc) => doc.id);
          setDocuments(documentsData);
          setDocumentsID(documentsID);
        }
    
        getAllDocuments();

      } else {
        // User is signed out
        // ...
      }
    }, []);

  }, [])

  return (
    <div className="App">
        <Navbar />
        
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/register/admin' element={<RegisterAdmin/>}/>
          <Route path='/register/staff' element={<RegisterStaff/>}/>
          <Route path='/register-SSO' element={<RegisterSSO/>}/>
          <Route path='/register-SSO/admin' element={<RegisterSSOAdmin/>}/>
          <Route path='/register-SSO/staff' element={<RegisterSSOStaff/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/staff-home' element={<HomeStaff/>}/>
          {documents.map((document, index) => (
          <Route key={index} path={`/Home/:ppecID`} element={<PPECDetails/>}/>
          ))}
        </Routes>
    </div>
  );
}

export default App;
