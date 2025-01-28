import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../AuthContext";
import { IoTimerOutline } from "react-icons/io5";
import { BsGraphUp, BsChatLeftText } from "react-icons/bs";
import UserReportCard from "./UserReportCard";
import { useNavigate } from "react-router-dom";
import '../styles/DashboardData.css';

function DashboardData({ leaderboard, userReports, handleDelete }) {
    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const backgroundImages = [
        '/images/panther-map.png',
        '/images/payload-map.jpg',
        '/images/shibuya-map.png',
        '/images/spider-map.png',
        '/images/tokyo-map.png',
    ];

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
            } catch (error) {
                console.log("Error fetching user data: ", error);
            }
        };
        if (user) {
            fetchUserData();
        }
    }, [user]);

    if (!user) {
        return <div>Loading ...</div>;
    }

    const getTimeSinceLastReport = () => {
        if (!userData || !userData.lastReport) return null;

        const lastReportTime = userData.lastReport.toDate();
        return {
            hours: Math.floor((new Date() - lastReportTime) / (1000 * 60 * 60)),
            minutes: Math.floor((new Date() - lastReportTime) / (1000 * 60)) % 60,
        };
    };

    const timeSinceLastReport = getTimeSinceLastReport();

    return (
        <div className="data-container">
            <div className="time-container">
                <div className="icon-area">
                    <IoTimerOutline className="clock-icon" />
                </div>
                <div className="text-area">
                    {timeSinceLastReport ? (
                        <div>
                            It's been {timeSinceLastReport.hours} hours and {timeSinceLastReport.minutes} minutes since your last report
                        </div>
                    ) : (
                        <div>You haven't made a report yet</div>
                    )}
                </div>
            </div>
            <div className="report-count-container">
                <div className="icon-area">
                    <BsGraphUp className="graph-icon" />
                </div>
                <div className="text-area">
                    {userData && (
                        <div>
                            You've reported {userData.reportCount} {userData.reportCount !== 1 ? "people" : "person"}
                        </div>
                    )}
                </div>
            </div>
            <hr className="line" />
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
                                handleDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
            <hr className="line" />
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
            <hr className="line" />
            <div className="button-container">
                <button className="report-feed-button" onClick={() => navigate('/reportfeed')}>
                    <BsChatLeftText /> Report Feed
                </button>
            </div>
        </div>
    );
}

export default DashboardData;
