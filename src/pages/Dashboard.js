import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { Timestamp, collection, deleteDoc, doc, getDocs, increment, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import DashboardData from "../components/DashboardData";
import { FaSignOutAlt } from "react-icons/fa";
import '../styles/Dashboard.css';
import CreateReport from "../components/CreateReport";

function Dashboard() {
    const { user } = useContext(AuthContext);

    const [leaderboard, setLeaderboard] = useState([]);
    const [reportedTag, setReportedTag] = useState("");
    const [reportComment, setReportComment] = useState("");
    const [userReports, setUserReports] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

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
                    reportCount: doc.data().reportCount,
                }));
                setLeaderboard(leaderboardData || []);
                console.log("Successfully fetched leaderboard");
            } catch (error) {
                console.log("Error fetching leaderboard: ", error);
            }
        };

        const fetchUserReports = async () => {
            try {
                const reportsRef = collection(db, "reports");
                const recentReports = query(
                    reportsRef,
                    where("userId", "==", user.uid),
                    orderBy("timeOfReport", "desc"),
                    limit(10)
                );
                const reportSnap = await getDocs(recentReports);
                const recentReportData = reportSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserReports(recentReportData);
                console.log("Successfully fetched user reports");
            } catch (error) {
                console.log("Error fetching user reports: ", error);
            }
        };

        fetchLeaderboard();
        fetchUserReports();
    }, [user]);

    if (!user) {
        return <div>Loading ...</div>;
    }

    // create report
    const handleCreateReport = async (reportedTag, reportComment) => {
        if (!reportedTag.trim()) return;

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

            const newLeaderboard = [...leaderboard];
            const userInLeaderboard = newLeaderboard.find((contestant) => contestant.id === user.uid);
            if(userInLeaderboard) {
                userInLeaderboard.reportCount += 1;
            } else {
                newLeaderboard.push({
                    id: user.uid,
                    name: user.displayName,
                    reportCount: 1,
                })
            }
            newLeaderboard.sort((a, b) => b.reportCount - a.reportCount);
            setLeaderboard(newLeaderboard.slice(0, 3));

            console.log("Report successfully created for: ", reportedTag);
            setUserReports((prevFeed) => [newReport, ...prevFeed]);
            setReportedTag("");
            setReportComment("");
        } catch (error) {
            console.log("Error creating report: ", error);
        }
    };

    const handleDelete = async (reportId) => {
        try {
            const reportRef = doc(db, "reports", reportId);
            await deleteDoc(reportRef);
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                reportCount: increment(-1),
            });
            // setLeaderboard((prevLeaderboard) =>
            //     prevLeaderboard.map((contestant) =>
            //         user.uid === contestant.id ? {...contestant, reportCount: contestant.reportCount - 1} : contestant
            //     )
            // );
            setLeaderboard((prevLeaderboard) => {
                if (!prevLeaderboard) return [];
                const updatedLeaderboard = prevLeaderboard.map((contestant) =>
                    contestant.id === user.uid
                        ? { ...contestant, reportCount: contestant.reportCount - 1 }
                        : contestant
                );
                updatedLeaderboard.sort((a, b) => b.reportCount - a.reportCount);
                return updatedLeaderboard.slice(0, 3);
            });
            setUserReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
            console.log("Report successfully deleted: ", reportId);
        } catch (error) {
            console.log("Error deleting post: ", error);
        }
    }

    const handleSignOut = async () => {
        try {
            signOut(auth);
            navigate("/");
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="welcome-text">
                Welcome,
                <span className="display-name">{user.displayName}</span>
            </h1>
            <DashboardData leaderboard={leaderboard} userReports={userReports} handleDelete={handleDelete}/>
            <CreateReport
                reportedTag={reportedTag}
                setReportedTag={setReportedTag}
                reportComment={reportComment}
                setReportComment={setReportComment}
                handleReport={handleCreateReport}
            />
            <div className="signout-container">
                <button onClick={handleSignOut} className="signout-button">
                    <FaSignOutAlt />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
