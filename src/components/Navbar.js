import React from 'react';
// import { Link } from 'react-router-dom'; // If you're using React Router
import { getAuth, signOut } from "firebase/auth";

function Navbar() {

   const auth = getAuth();

   const handleLogout = () => {
      signOut(auth)
      .then(() => {
         window.location.replace("/");
      })
   };

   return (
      <nav id="header" className="w-full z-30 py-1 bg-indigo-600 shadow-lg">
         <div className="w-full flex items-center justify-between mt-0 px-10 py-2">
            <input className="hidden" type="checkbox" id="menu-toggle"></input>
            
            <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
               <h1 className="inline-block text-white no-underline font-medium text-lg py-2 px-4 lg:-ml-2">
                  PPEC
               </h1>
            </div>
            
            <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
               <div className="auth flex items-center w-full md:w-full">
                  <button
                     className="bg-white text-gray-800 font-semibold p-2 rounded  hover:bg-gray-800 hover:text-white transition-colors duration-300"
                     onClick={handleLogout}
                  >
                     Log out
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
}

export default Navbar;