import React from "react";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";

const CustomRouter = () => {
    const isPanelRoute = window.location.pathname.includes("/panel");
    return isPanelRoute ? <AdminRouter /> : <UserRouter />;
};

export default CustomRouter;
