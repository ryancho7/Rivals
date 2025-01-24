import React from "react";
import { BiLike } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { MdOutlineInsertComment } from "react-icons/md";
import '../styles/UserReportCard.css';

function UserReportCard({ report, backgroundImage }) {
    return (
        <div 
            className="report-card"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="main-content">
                <p className="user-content"><FiUser />: {report.reportedPlayer}</p>
                <hr />
                <p className="comment-content"><MdOutlineInsertComment />: {report.comments}</p>
                <p className="like-content">{report.likeCount}<BiLike /></p>
            </div>
            <div className="time-content">
                <p>Reported At {report.timeOfReport.toDate().toLocaleString()}</p>
            </div>
            <div className="fade-overlay"></div>
        </div>
    )
}

export default UserReportCard;