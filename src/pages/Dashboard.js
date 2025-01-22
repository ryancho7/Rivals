import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, increment, limit, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import DashboardData from "../components/DashboardData";
import '../styles/Dashboard.css';
import UserReportCard from "../components/UserReportCard";

function Dashboard() {

    const { user } = useContext(AuthContext);

    const [ reportFeed, setReportFeed ] = useState([]);
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
        const fetchReports = async () => {
            try {
                const reportsRef = collection(db, "reports");
                const recentReports = query(reportsRef, orderBy("timeOfReport", "desc"), limit(20));
                const reportSnap = await getDocs(recentReports);
                // update local state
                const reportsData = reportSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReportFeed(reportsData);
                console.log("Successfully fetched reports");
            } catch (error) {
                console.log("Error fetching reports: ", error);
            }
        }

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
        fetchReports();
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
    
    // add like
    const handleLike = async (reportId) => {
        if (!user) return;
        try {
            const reportRef = doc(db, "reports", reportId);
            const likeRef = doc(db, "reports", reportId, "likes", user.uid);

            const likeSnap = await getDoc(likeRef);

            if(likeSnap.exists()) {
                // remove the like
                await deleteDoc(likeRef);
                await updateDoc(reportRef, {
                    likeCount: increment(-1),
                });
                console.log("Like removed from this report: ", reportId);
            } else {
                // add the like
                await setDoc(likeRef, {
                    timestamp: Timestamp.now()
                });
                await updateDoc(reportRef, {
                    likeCount: increment(1),
                });
                console.log("Like successfully added to this report: ", reportId);
            }
        } catch (error) {
            console.log("Error adding/removing like: ", error);
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
            <button onClick={handleSignOut}>Sign Out</button>
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
            <div className="report-feed">
                {reportFeed.length === 0 ? (
                    <div>Looks like no one has reported yet ...</div>
                ) : (
                    reportFeed.map((report) => (
                        <UserReportCard key={report.id} report={report}/>
                    ))
                )}   
            </div>
        </div>
    )
}

export default Dashboard;