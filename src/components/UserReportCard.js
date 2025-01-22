import React from "react";
import '../styles/UserReportCard.css';

function UserReportCard({ report}) {
    return (
        <div className="report-card">
            <p>Reported Player: {report.reportedPlayer}</p>
            <p>Time: {report.timeOfReport.toDate().toLocaleString()}</p>
            <p>Likes: {report.likeCount}</p>
            <p>{report.comments}</p>
            <p>Reported By: {report.username}</p>
        </div>
    )
}

export default UserReportCard;