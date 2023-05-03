import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { getDoc, doc, getDocs, collection, query } from "firebase/firestore";
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

function DateDetails(props) {

  const [data, setData] = useState({});
  const [clientsChanges, setClientsChanges] = useState([]);
  const [GeoLocation, setGeoLocation] = useState('');
  const [opDays, setOpDays] = useState([]);
  const [staffTracking, setStaffTracking] = useState([]);
  const [complianceUpdate, setComplianceUpdate] = useState([]);
  const [staffData, setStaffData] = useState([]);
  
  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    list: {
      margin: 12,
      fontSize: 14,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    listItemBullet: {
      width: 10,
      fontSize: 14,
      textAlign: 'center',
    },
    listItemContent: {
      flex: 1,
      fontSize: 14,
    },
    staffItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    staffItemAvatar: {
      width: 40,
      height: 40,
      marginRight: 10,
      borderRadius: 20,
    },
    staffItemName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    staffItemTitle: {
      fontSize: 14,
    },
    staffContainer: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      alignItems: 'center',
    },
  });

  useEffect(() => {
    async function getAllDocuments() {
      const docRef = doc(db, "PPEC", props.id, "history", props.date);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        const fetchedClientsData = docSnap.data().ClientsChanges;
        const fetchedStaffTracking= docSnap.data().staffTracking;
        const fetchedComplianceUpdate= docSnap.data().ComplianceUpdate;
        const fetchedGeoData = docSnap.data().location;
        const fetchedDays = docSnap.data().opertionalDays;
        setClientsChanges(fetchedClientsData);
        setStaffTracking(fetchedStaffTracking);
        setComplianceUpdate(fetchedComplianceUpdate);
        setData(fetchedData);
        setGeoLocation(fetchedGeoData);
        setOpDays(fetchedDays)
      }


      const q = query(collection(db, "PPEC", props.id, "history", props.date, "staff"));
      const querySnapshot = await getDocs(q);
      const documentsData = querySnapshot.docs.map((doc) => doc.data());
      setStaffData(documentsData);
    }
    getAllDocuments();
  }, [props.date, props.id]);

  const daysPDF = opDays.map((day, index) => (
    <Text className="mb-2 text-gray-600" key={index}>{day === 1? "Sunday": day === 2? "Monday" : day === 3? "Tuesday" : day === 4? "Wednesday" : day === 5? "Thursday" :day === 6 ? "Friday" : day === 7? "Saturday" :null}</Text>
  ));
  const clientsListPDF = clientsChanges.map((clientChange, index) => (
    <Text className="mb-2 text-gray-600" key={index}>{clientChange}</Text>
  ));
  const staffTrackListPDF = staffTracking.map((staffTrack, index) => (
    <Text className="mb-2 text-gray-600" key={index}>{staffTrack}</Text>
  ));
  const compUpdatePDF = complianceUpdate.map((compUp, index) => (
    <Text className="mb-2 text-gray-600" key={index}>{compUp}</Text>
  ));

  const days = opDays.map((day, index) => (
    <li className="mb-2 text-gray-600" key={index}>{day === 1? "Sunday": day === 2? "Monday" : day === 3? "Tuesday" : day === 4? "Wednesday" : day === 5? "Thursday" :day === 6 ? "Friday" : day === 7? "Saturday" :null}</li>
  ));
  const clientsList = clientsChanges.map((clientChange, index) => (
    <li className="mb-2 text-gray-600" key={index}>{clientChange}</li>
  ));
  const staffTrackList = staffTracking.map((staffTrack, index) => (
    <li className="mb-2 text-gray-600" key={index}>{staffTrack}</li>
  ));
  const compUpdate = complianceUpdate.map((compUp, index) => (
    <li className="mb-2 text-gray-600" key={index}>{compUp}</li>
  ));

  return (
    <>

      <div className="bg-white p-6">
        <PDFDownloadLink document={
        <>
          <Document>
            <Page>
              <View style={styles.section}>
                <Text style={styles.title}>{data.centerName} ({data.centerAdressName})</Text>
                <Text style={styles.subtitle}>State: {data.state}</Text>
                <Text style={styles.subtitle}>City: {data.city}</Text>
                <Text style={styles.subtitle}>Zip Code: {data.zipCode}</Text>
                <Text style={styles.subtitle}>Opening Time: {data.openTime}</Text>
                <Text style={styles.subtitle}>Closing Time: {data.closeTime}</Text>
                <Text style={styles.subtitle}>Location: Latitude: {GeoLocation._lat}, Longitude: {GeoLocation._long}</Text>
                <Text style={styles.subtitle}>Radius: {data.radius}</Text>
                <Text style={styles.subtitle}>
                  Compliance: {data.complient ? 'Site Compliant' : 'Site Non-Compliant'}
                </Text>
                <Text style={styles.subtitle}>Clients: {data.clients}</Text>
                <Text style={styles.subtitle}>RN: {data.RN || 0}</Text>
                <Text style={styles.subtitle}>LPN: {data.LPN || 0}</Text>
                <Text style={styles.subtitle}>CNA: {data.CNA || 0}</Text>
                <Text style={styles.subtitle}>onSiteRN: {data.onSiteRN || 0}</Text>
                <Text style={styles.subtitle}>onSiteLPN: {data.onSiteLPN || 0}</Text>
                <Text style={styles.subtitle}>onSiteCNA: {data.onSiteCNA || 0}</Text>
                <Text style={styles.subtitle}>
                  Operational Days: {daysPDF}
                </Text>
                <Text style={styles.subtitle}>Clients Changes:</Text>
                <View style={styles.list}>
                  {clientsListPDF.map((item, index) => (
                    <Text style={styles.listItem} key={index}>
                      {item}
                    </Text>
                  ))}
                </View>
                <Text style={styles.subtitle}>Staff Tracking Updates:</Text>
                <View style={styles.list}>
                  {staffTrackListPDF.map((item, index) => (
                    <Text style={styles.listItem} key={index}>
                      {item}
                    </Text>
                  ))}
                </View>
                <Text style={styles.subtitle}>Compliance Updates:</Text>
                <View style={styles.list}>
                  {compUpdatePDF.map((item, index) => (
                    <Text style={styles.listItem} key={index}>
                      {item}
                    </Text>
                  ))}
                </View>
                <Text style={styles.subtitle}>Staff Members:</Text>
                {staffData.map((staff, index) => (
                  <View key={index} style={styles.staffContainer}>
                    <Text style={styles.staffItem}>Name: {staff.firstName}</Text>
                    <Text style={styles.staffItem}>Email Address: {staff.email}</Text>
                    <Text style={styles.staffItem}>Job Title: {staff.jobTitle}</Text>
                    <Text style={styles.staffItem}>Clock In: {staff.clockIn}</Text>
                    <Text style={styles.staffItem}>Clock Out: {staff.clockOut}</Text>
                  </View>
                ))}
              </View>
            </Page>
          </Document>
        </>
        } fileName={`report-${props.date}.pdf`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Save as PDF'
        }
      </PDFDownloadLink>
          <div id='daily-report' className="text-left m-10">
            <h2 className="text-2xl font-bold mb-2">{data.centerName} <span className='font-bold text-lg'>({data.centerAdressName})</span></h2>
            <p className="text-gray-600 mb-1"><span className='font-bold'>State:</span> {data.state}</p>
            <p className="text-gray-600 mb-1"> <span className='font-bold'>City:</span> {data.city}</p>
            <p className="text-gray-600 mb-1"> <span className='font-bold'>Zip Code:</span> {data.zipCode}</p>
            <p className="text-gray-600 mb-1"> <span className='font-bold'>Opening Time:</span> {data.openTime}</p>
            <p className="text-gray-600 mb-1"> <span className='font-bold'>Closing Time:</span> {data.closeTime}</p>
            <p className="text-gray-600 mb-1"> <span className='font-bold'>Location:</span> Latitude: {GeoLocation._lat}, Longitude: {GeoLocation._long} </p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>Radius:</span> {data.radius}</p>
            <p className='text-gray-600 mb-1 font-bold'>Compliance: {data.complient? <span className="text-green-600 mb-1 font-medium"> Site Compliant </span>: <span className="text-red-600 mb-1 font-medium"> Site Non-Compliant </span>}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>Clients:</span> {data.clients}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>RN:</span> {data.RN || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>LPN:</span> {data.LPN || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>CNA:</span> {data.CNA || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>onSiteRN:</span> {data.onSiteRN || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>onSiteLPN:</span> {data.onSiteLPN || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold'>onSiteCNA:</span> {data.onSiteCNA || 0}</p>
            <p className="text-gray-600 mb-1"><span className='font-bold underline'>Opertional Days:</span> {days}</p>
            <p className="text-gray-600 mb-1 font-bold underline">Clients Changes:</p>
            <ul className=" list-decimal pl-4 mb-4">{clientsList}</ul>
            <p className="text-gray-600 mb-1 font-bold underline">Staff Tracking Updates:</p>
            <ul className=" list-decimal pl-4 mb-4">{staffTrackList}</ul>
            <p className="text-gray-600 mb-1 font-bold underline">Compliance Updates:</p>
            <ul className=" list-decimal pl-4 mb-4">{compUpdate}</ul>
            <p className="text-gray-600 mb-1 font-bold underline">Staff Members:</p>
            {staffData.map((staff, index) => (
              <div key={index} className='border border-gray-400 p-2 w-1/2' style={{"overflowWrap":"break-word"}}>
                <ul className=" list-decimal text-gray-600 pl-4 mb-2">Name: {staff.firstName}</ul>
                <ul className=" list-decimal text-gray-600 pl-4 mb-2">Email Address: {staff.email}</ul>
                <ul className=" list-decimal text-gray-600 pl-4 mb-2">Job Title: {staff.jobTitle}</ul>
                <ul className=" list-decimal text-gray-600 pl-4 mb-2">Clock In: {staff.clockIn}</ul>
                <ul className=" list-decimal text-gray-600 pl-4 mb-2">Clock Out: {staff.clockOut}</ul>
              </div>
            ))}
          </div>
      </div>
    </>

  );
}

export default DateDetails;
