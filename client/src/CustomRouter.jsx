import React, { Suspense } from "react";
import UserRouter from "./router/UserRouter";
import Loader from "./components/Loader/Loader";
const AdminRouter = React.lazy(() => import("./router/AdminRouter"));

const CustomRouter = () => {
    const isPanelRoute = window.location.pathname.includes("/panel");
    return isPanelRoute ? (
        <Suspense fallback={<Loader classes="h-screen" />}>
            <AdminRouter />
        </Suspense>
    ) : (
        <UserRouter />
    );
};

export default CustomRouter;
