import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../AuthContext";
import { IoTimerOutline } from "react-icons/io5";
import { BsGraphUp, BsChatLeftText } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

import '../styles/DashboardData.css';
import UserReportCard from "./UserReportCard";

function DashboardData({ leaderboard }) {

    const { user } = useContext(AuthContext);

    const [ userReports, setUserReports ] = useState([]);
    const [ userData, setUserData ] = useState(null);

    const backgroundImages = [
        '/images/panther-map.png',
        '/images/payload-map.jpg',
        '/images/shibuya-map.png',
        '/images/spider-map.png',
        '/images/tokyo-map.png',
    ];

    useEffect(() => {
        const fetchUserReports = async (userId) => {
            try {
                const reportsRef = collection(db, "reports");
                const recentReports = query(
                    reportsRef,
                    where("userId", "==", userId),
                    orderBy("timeOfReport", "desc"),
                    limit(10)
                );
                const reportSnap = await getDocs(recentReports);
                const recentReportData = reportSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserReports(recentReportData);
                console.log("Successfully fetched user reports");
            } catch (error) {
                console.log("Error fetching user reports: ", error);
            }
        }
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if(userSnap.exists()) {
                    setUserData(userSnap.data());
                }
            } catch (error) {
                console.log("Error fetching user data: ", error);
            }
        }
        if (user) {
            fetchUserReports(user.uid);
            fetchUserData();
        }
    },[user]);

    if(!user) {
        return <div>Loading ...</div>
    }

    const getTimeSinceLastReport = () => {
        if (!userData || !userData.lastReport) return null;
        
        const lastReportTime = userData.lastReport.toDate();
        return {
            hours: Math.floor((new Date() - lastReportTime) / (1000 * 60 * 60)),
            minutes: Math.floor((new Date() - lastReportTime) / (1000 * 60)) % 60,
        };
    }

    const timeSinceLastReport = getTimeSinceLastReport();

    return (
        <div className="data-container">
                <div className="time-container">
                    <div className="icon-area">
                        <IoTimerOutline className="clock-icon"/>
                    </div>
                    <div className="text-area">
                        {timeSinceLastReport ? (
                            <div>It's been {timeSinceLastReport.hours} hours and {timeSinceLastReport.minutes} minutes since your last report</div>
                        ) : (
                            <div>You haven't made a report yet</div>
                        )}
                    </div>
                </div>
                <div className="report-count-container">
                    <div className="icon-area">
                        <BsGraphUp className="graph-icon"/>
                    </div>
                    <div className="text-area">
                        {userData && (
                            <div>You've reported {userData.reportCount} {userData.reportCount !== 1 ? "people" : "person"}</div>
                        )}
                    </div>
                </div>
                <hr className="line"/>
                <div className="user-reports-container">
                    <h1 className="user-report-header">Your Recent Reports</h1>
                    <div className="recent-reports">
                        {userReports.length === 0 ? (
                            <div className="no-reports">You haven't reported anyone recently</div>
                        ) : (
                            userReports.map((report, index) => (
                                <UserReportCard 
                                    key={report.id} 
                                    report={report}
                                    backgroundImage={backgroundImages[index % backgroundImages.length]}
                                />
                            ))
                        )}
                    </div>
                </div>
                <hr className="line"/>
                <div className="leaderboard">
                    <h1 className="leaderboard-header">The Current Leaderboard Standings</h1>
                    {leaderboard.length === 0 ? (
                        <div>It's so quiet here ...</div>
                    ) : (
                        leaderboard.map((user, index) => (
                            <div key={user.id}>
                                {index + 1}. {user.name} - {user.reportCount} reports!
                            </div>
                        ))
                    )}
                </div>
                <hr className="line"/>
                <div className="button-container">
                    <button className="report-feed-button"><BsChatLeftText /> Report Feed</button>
                    <button className="edit-report-button"><FaRegEdit /> Edit Reports</button>
                </div>
            </div>
    )
}

export default DashboardData;