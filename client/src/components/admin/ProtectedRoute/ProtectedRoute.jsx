import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, permission }) => {
    const userPermissions = useSelector((state) => state.adminAuth.user.permissions);

    if (!userPermissions?.includes(permission)) {
        return <Navigate to="/panel/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
