import React from "react";
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/admin/Login";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import Profile from "./pages/admin/Profile";
import PanelUsers from "./pages/admin/PanelUsers";
import Roles from "./pages/admin/Roles";
import Customers from "./pages/admin/Customers";
import Audits from "./pages/admin/Audits";
import Orders from "./pages/admin/Orders";
import Transactions from "./pages/admin/Transactions";
import Products from "./pages/admin/Products";
import Inventory from "./pages/admin/Inventory";

const CustomRouter = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route path="panel/login" element={<Login />} />
                <Route path="panel/forgot-password" element={<ForgotPassword />} />
                <Route path="panel/reset-password" element={<ResetPassword />} />
                <Route path="panel/profile" element={<Profile />} />
                <Route path="panel/customers" element={<Customers />} />
                <Route path="panel/orders" element={<Orders />} />
                <Route path="panel/transactions" element={<Transactions />} />
                <Route path="panel/products" element={<Products />} />
                <Route path="panel/inventory" element={<Inventory />} />
                <Route path="panel/roles" element={<Roles />} />
                <Route path="panel/panel-users" element={<PanelUsers />} />
                <Route path="panel/audits" element={<Audits />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default CustomRouter;
