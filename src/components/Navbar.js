import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase.js";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [inAppNotification, setInAppNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const [realTimeAlerts, setRealTimeAlerts] = useState(false);
  const [dailySummaries, setDailySummaries] = useState(false);
  const [weeklyOverviews, setWeeklyOverviews] = useState(false);
  const [userID, setUserID] = useState(null);

  const auth = getAuth();
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Remove the onAuthStateChanged listener
      return onAuthStateChanged(auth, () => {});
    };
  }, [popupRef, auth]);

  useEffect(() => {
    // Store the unsubscribe function to be used in the cleanup function
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserID(uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsAdmin(docSnap.data()?.isAdmin);
        } else {
          setIsAdmin(false);
        }

        onSnapshot(doc(db, "users", uid), (doc) => {
          const data = doc.data();
          if (data) {
            setEmailNotification(data.NotificationChannels?.email);
            setInAppNotification(data.NotificationChannels?.["in-app-notifications"]);
            setSmsNotification(data.NotificationChannels?.sms);

            setDailySummaries(data.NotificationFrequency?.["daily-summaries"]);
            setRealTimeAlerts(data.NotificationFrequency?.["real-time-alerts"]);
            setWeeklyOverviews(data.NotificationFrequency?.["weekly-overviews"]);
          }
        });
      }
    });

    return unsubscribe; // Return the unsubscribe function
  }, [auth]);

  const EmailNotificationHandler = async() => {
    setEmailNotification(!emailNotification);
    await updateDoc(doc(db, "users", userID), {
      "NotificationChannels.email": !emailNotification,
    });
  }
  const InAppNotificationHandler = async() => {
    setInAppNotification(!inAppNotification);
    await updateDoc(doc(db, "users", userID), {
      "NotificationChannels.in-app-notifications": !inAppNotification,
    });
  }
  const SmsNotificationHandler = async() => {
    setSmsNotification(!smsNotification);
    await updateDoc(doc(db, "users", userID), {
      "NotificationChannels.sms": !smsNotification,
    });
  }

  const DailySummariesHandler = async() => {
    setDailySummaries(true);
    await updateDoc(doc(db, "users", userID), {
      "NotificationFrequency.daily-summaries": true,
      "NotificationFrequency.real-time-alerts": false,
      "NotificationFrequency.weekly-overviews": false,
    });
  }
  const RealTimeAlertsHandler = async() => {
    setRealTimeAlerts(true);
    await updateDoc(doc(db, "users", userID), {
      "NotificationFrequency.daily-summaries": false,
      "NotificationFrequency.real-time-alerts": true,
      "NotificationFrequency.weekly-overviews": false,
    });
  }
  const WeeklyOverviewsHandler = async() => {
    setWeeklyOverviews(true);
    await updateDoc(doc(db, "users", userID), {
      "NotificationFrequency.daily-summaries": false,
      "NotificationFrequency.real-time-alerts": false,
      "NotificationFrequency.weekly-overviews": true,
    });
  }

  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.replace("/");
    });
  };

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  return (
    <nav id="header" className="w-full z-30 py-1 bg-indigo-600 shadow-lg">
      <div className="w-full flex items-center justify-between mt-0 px-10 py-2">
        <input className="hidden" type="checkbox" id="menu-toggle" />
        <div
          className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"
          id="menu"
        >
          <h1 className="inline-block text-white no-underline font-medium text-lg py-2 px-4 lg:-ml-2">
            PPEC
          </h1>
        </div>
        <div
          className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4 w-[10%]"
          id="nav-content"
        >
          <div className="auth flex justify-between items-center w-full md:w-full">
            <button
              className="bg-white text-gray-800 font-semibold p-2 rounded  hover:bg-gray-800 hover:text-white transition-colors duration-300"
              onClick={handleLogout}
            >
              Log out
            </button>
            {isAdmin ? (
              <div className="relative" ref={popupRef}>
                <FontAwesomeIcon
                  icon={faCog}
                  className="text-white cursor-pointer hover:text-gray-800 transition-colors duration-300"
                  size="2x"
                  onClick={handlePopupToggle}
                />
                {showPopup && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handlePopupToggle}
                  >
                    <div
                      className="bg-white p-8 shadow-2xl rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-2xl font-bold mb-6">Notification Prefrence</h2>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          Notification Channels
                        </h3>
                        <ul className="list-disc list-inside ml-4">
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                emailNotification
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={EmailNotificationHandler}
                            />
                            Email
                          </li>
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                inAppNotification
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={InAppNotificationHandler}
                            />
                            In-app notifications
                          </li>
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                smsNotification
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={SmsNotificationHandler}
                            />
                            SMS
                          </li>
                        </ul>
                      </div>
                      <hr className="my-4" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Notification Frequency
                        </h3>
                        <ul className="list-disc list-inside ml-4">
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                realTimeAlerts
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={RealTimeAlertsHandler}
                            />
                            Real-time alerts
                          </li>
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                dailySummaries
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={DailySummariesHandler}
                            />
                            Daily summaries
                          </li>
                          <li className="flex items-center mb-1">
                            <button
                              className={`h-4 w-4 border-2 rounded-full mr-2 ${
                                weeklyOverviews
                                  ? "bg-blue-500 border-gray-400"
                                  : "border-gray-400"
                              }`}
                              onClick={WeeklyOverviewsHandler}
                            />
                            Weekly overviews
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
