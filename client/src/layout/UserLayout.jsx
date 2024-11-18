import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/user/Header/Header";
import Footer from "../components/user/Footer/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    const { status } = useSelector((state) => state.adminAuth);

    return (
        <div className="flex flex-col relative">
            <Header />
            <main className="min-h-screen flex-1 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
