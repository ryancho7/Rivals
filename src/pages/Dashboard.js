import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { Timestamp, collection, doc, getDocs, increment, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import DashboardData from "../components/DashboardData";
import { FaSignOutAlt } from "react-icons/fa";
import '../styles/Dashboard.css';

function Dashboard() {

    const { user } = useContext(AuthContext);

    const [ leaderboard, setLeaderboard ] = useState([]);
    const [ reportedTag, setReportedTag ] = useState("");
    const [ reportComment, setReportComment ] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    },[user, navigate]);

    // fetch data from firestore
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const userRef = collection(db, "users");
                const topUsers = query(userRef, orderBy("reportCount", "desc"), limit(3));
                const topUsersSnap = await getDocs(topUsers);
                // update local state
                const leaderboardData = topUsersSnap.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    reportCount: doc.data().reportCount
                }));
                setLeaderboard(leaderboardData || []);
                console.log("Successfully fetched leaderboard");
            } catch (error) {
                console.log("Error fetching leaderboard: ", error);
            }
        }
        // fetchReports();
        fetchLeaderboard();
    },[]);

    if(!user) {
        return <div>Loading ...</div>
    }

    // create report
    const handleCreateReport = async (reportedTag, reportComment) => {

        if(!reportedTag.trim()) return;

        const reportId = uuidv4();
        const newReport = {
            reportedPlayer: reportedTag,
            timeOfReport: Timestamp.now(),
            likeCount: 0,
            userId: user.uid,
            username: user.displayName,
            comments: reportComment,
        };
        
        try {
            const reportRef = doc(db, "reports", reportId);
            // update reports
            await setDoc(reportRef, newReport);
            // update user reports
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                reportCount: increment(1),
                lastReport: newReport.timeOfReport,
            });
            console.log("Report successfully created for: ", reportedTag);
            setReportedTag("");
            setReportComment("");
        } catch (error) {
            console.log("Error creating report: ", error);
        }

    }

    const handleSignOut = async () => {
        try {
            signOut(auth);
            navigate("/");
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    }

    return (
        <div className="dashboard-container">
            <h1 className="welcome-text">
                Welcome,
                <span className="display-name">{user.displayName}</span>
            </h1>
            <DashboardData leaderboard={leaderboard}/>
            <div className="signout-container">
                <button onClick={handleSignOut} className="signout-button"><FaSignOutAlt />Sign Out</button>
            </div>
            <div className="create-report">
                <input
                    type="text"
                    placeholder="Reported Player Username"
                    value={reportedTag}
                    onChange={(e) => setReportedTag(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Additional Comments"
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                />
                <button onClick={() => handleCreateReport(reportedTag, reportComment)}>Submit Report</button>
            </div>
        </div>
    )
}

export default Dashboard;