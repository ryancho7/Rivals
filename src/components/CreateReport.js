import React from "react";
import '../styles/CreateReport.css';
import { useNavigate } from "react-router-dom";

function CreateReport({ reportedTag, setReportedTag, reportComment, setReportComment, handleReport }) {

    const navigate = useNavigate();

    return (
        <div className="create-report-container">
            <h3 className="create-header">Create a Report</h3>
            <input
                type="text"
                placeholder="Reported Player Username"
                value={reportedTag}
                onChange={(e) => setReportedTag(e.target.value)}
            />
            <textarea
                placeholder="Additional Comments"
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
            />
            <button onClick={() => {
                handleReport(reportedTag, reportComment);
                navigate("/thanks");
            }}>Submit Report</button>
        </div>
    );
}

export default CreateReport;
