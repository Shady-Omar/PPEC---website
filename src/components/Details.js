import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';


function Details(props) {
  const name = props.location.state.name;

  console.log(name)

  return (
    <>
      <h1>{name}</h1>
    </>
  );
}

export default Details;