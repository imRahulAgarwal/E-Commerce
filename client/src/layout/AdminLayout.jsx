import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/admin/Header/Header";
import Sidebar from "../components/admin/Sidebar/Sidebar";
import useResponsiveSidebar from "../hooks/useResponsiveSidebar";
import { useSelector } from "react-redux";

const AdminLayout = () => {
    const { status } = useSelector((state) => state.adminAuth);
    const [isSidebarOpen, setIsSidebarOpen] = useResponsiveSidebar();

    return (
        <div className="min-h-screen flex overflow-x-hidden relative">
            {status && <Sidebar isOpen={isSidebarOpen} />}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 max-h-screen overflow-hidden ${
                    isSidebarOpen && status ? "ms-60" : "ms-0"
                }`}>
                {status && <Header handleHamburgerBtn={() => setIsSidebarOpen((prev) => !prev)} />}
                {status && isSidebarOpen && window.innerWidth <= 768 && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}></div>
                )}
                <main className="h-full p-4 bg-gray-100 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
