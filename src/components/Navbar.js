import React from 'react';
// import { Link } from 'react-router-dom'; // If you're using React Router

function Navbar() {
  return (
    <nav id="header" className="w-full z-30 py-1 bg-indigo-600 shadow-lg fixed">
      <div className="w-full flex items-center justify-between mt-0 px-10 py-2">
         <input className="hidden" type="checkbox" id="menu-toggle"></input>
         
         <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
            <h1 className="inline-block text-white no-underline font-medium text-lg py-2 px-4 lg:-ml-2">
              PPEC
            </h1>
         </div>
         
         {/* <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
            <div className="auth flex items-center w-full md:w-full">
               <button className="bg-transparent text-gray-800  p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700">Sign in</button>
               <button className="bg-blue-600 text-gray-200  p-2 rounded  hover:bg-blue-500 hover:text-gray-100">Sign up</button>
            </div>
         </div> */}
      </div>
   </nav>
  );
}

export default Navbar;