import React from "react";
import '../styles/UserReportCard.css';

function UserReportCard({ report, backgroundImage }) {
    return (
        <div 
            className="report-card"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="main-content">
                <p>Reported Player: {report.reportedPlayer}</p>
                <p>Likes: {report.likeCount}</p>
                <p>{report.comments}</p>
            </div>
            <div className="time-content">
                <p>Reported At {report.timeOfReport.toDate().toLocaleString()}</p>
            </div>
            <div className="fade-overlay"></div>
        </div>
    )
}

export default UserReportCard;