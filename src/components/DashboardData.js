import React, { useContext, useEffect, useState } from "react";
import '../styles/DashboardData.css';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../AuthContext";

function DashboardData() {

    const { user } = useContext(AuthContext);

    const [ userReports, setUserReports ] = useState([]);
    const [ userData, setUserData ] = useState(null);

    useEffect(() => {
        const fetchUserReports = async (userId) => {
            try {
                const reportsRef = collection(db, "reports");
                const recentReports = query(
                    reportsRef,
                    where("userId", "==", userId),
                    orderBy("timeOfReport", "desc"),
                    limit(5)
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
            This is the data section
            {timeSinceLastReport ? (
                <div>It's been {timeSinceLastReport.hours} hours and {timeSinceLastReport.minutes} minutes since your last report</div>
            ) : (
                <div>You haven't made a report yet</div>
            )}
            <div className="recent-reports">
                {userReports.length === 0 ? (
                    <div className="no-reports">You haven't reported anyone recently</div>
                ) : (
                    userReports.map((report) => (
                        <div key={report.id} className="report-item">
                            <p>Reported Player: {report.reportedPlayer}</p>
                            <p>Time: {report.timeOfReport.toDate().toLocaleString()}</p>
                            <p>Likes: {report.likeCount}</p>
                            <p>{report.comments}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default DashboardData;