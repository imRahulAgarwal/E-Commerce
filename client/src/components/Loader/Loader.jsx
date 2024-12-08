import React from "react";

const Loader = ({ classes }) => {
    return (
        <div className={`flex items-center justify-center bg-white m-auto ${classes}`}>
            <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
