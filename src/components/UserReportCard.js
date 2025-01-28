import React from "react";
import { BiLike } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { MdOutlineInsertComment } from "react-icons/md";
import { CiSquareRemove } from "react-icons/ci";
import '../styles/UserReportCard.css';

function UserReportCard({ report, backgroundImage, handleDelete }) {
    return (
        <div 
            className="report-card"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="main-content">
                <p className="user-content">
                    <FiUser className="user-icon"/>: <span>{report.reportedPlayer}</span>
                    <CiSquareRemove className="delete-icon" onClick={() => handleDelete(report.id)}/>
                </p>
                <hr />
                <p className="comment-content"><MdOutlineInsertComment />: <span>{report.comments}</span></p>
            </div>
            <div className="time-content">
                <p className="like-content">{report.likeCount}<BiLike className={`like-icon ${report.isLiked ? "active" : ""}`}/></p>
                <hr />
                <p className="time-p">Reported At {report.timeOfReport.toDate().toLocaleString()}</p>
            </div>
            <div className="fade-overlay"></div>
        </div>
    )
}

export default UserReportCard;