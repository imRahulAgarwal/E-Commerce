import React from "react";
import "./Loading.css";

const LoadingPage = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading, please wait...</p>
        </div>
    );
};

export default LoadingPage;
