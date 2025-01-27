import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { collection, deleteDoc, getDoc, doc, getDocs, increment, limit, orderBy, query, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import ReportFeedCard from "../components/ReportFeedCard.js";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import '../styles/ReportFeed.css';

function ReportFeed() {

    const { user } = useContext(AuthContext);

    const [ reportFeed, setReportFeed ] = useState([]);

    const navigate = useNavigate();

    const backgroundImages = [
        '/images/panther-map.png',
        '/images/tokyo-map.png',
        '/images/payload-map.jpg',
        '/images/shibuya-map.png',
        '/images/spider-map.png',
    ];

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    },[user, navigate]);

    useEffect(() => {
        const fetchReportFeed = async () => {
            try {
                const reportsRef = collection(db, "reports");
                const recentReports = query(reportsRef, orderBy("timeOfReport", "desc"), limit(20));
                const reportSnap = await getDocs(recentReports);
                // update local state
                const reportsData = await Promise.all(
                    reportSnap.docs.map(async (reportDoc) => {
                        const likeRef = doc(db, "reports", reportDoc.id, "likes", user?.uid);
                        const likeSnap = await getDoc(likeRef);
                        return {
                            id: reportDoc.id,
                            ...reportDoc.data(),
                            isLiked: likeSnap.exists(),
                        }
                    })
                );
                setReportFeed(reportsData);
                console.log("Successfully fetched reports");
            } catch (error) {
                console.log("Error fetching reports: ", error);
            }
        };
        fetchReportFeed();
    }, [user]);

    if(!user) {
        return <div>Loading ...</div>
    }

    // add like
    const handleLike = async (reportId) => {
        if (!user) return;
        try {
            const reportRef = doc(db, "reports", reportId);
            const likeRef = doc(db, "reports", reportId, "likes", user.uid);

            const likeSnap = await getDoc(likeRef);
            
            let addLike = false;

            if(likeSnap.exists()) {
                // remove the like
                await deleteDoc(likeRef);
                await updateDoc(reportRef, {
                    likeCount: increment(-1),
                });
                addLike = false;
                console.log("Like removed from this report: ", reportId);
            } else {
                // add the like
                await setDoc(likeRef, {
                    timestamp: Timestamp.now()
                });
                await updateDoc(reportRef, {
                    likeCount: increment(1),
                });
                addLike = true;
                console.log("Like successfully added to this report: ", reportId);
            }
            // update local state
            setReportFeed((prevReportFeed) => 
                prevReportFeed.map((report) => 
                    report.id === reportId ? {
                        ...report,
                        likeCount: addLike ? report.likeCount + 1 : report.likeCount - 1,
                        isLiked: addLike,
                    } : report
                )
            );
        } catch (error) {
            console.log("Error adding/removing like: ", error);
        }
    }

    return (
        <div className="report-feed-content">
            <h1 className="feed-header">The <span>Rivals</span> Feed</h1>
            <button className="return-button"><IoChevronBack  className="return-icon"/>Back</button>
            <div className="card-feed">
                {reportFeed.length === 0 ? (
                    <div className="no-reports">You haven't reported anyone recently</div>
                ) : (
                    reportFeed.map((report, index) => (
                        <ReportFeedCard 
                            key={report.id} 
                            report={report}
                            backgroundImage={backgroundImages[index % backgroundImages.length]}
                            handleLike={handleLike}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default ReportFeed;