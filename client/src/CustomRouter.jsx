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
import Products from "./pages/admin/Products";
import Inventory from "./pages/admin/Inventory";
import Customer from "./pages/admin/Customer";
import PanelUser from "./pages/admin/PanelUser";
import Role from "./pages/admin/Role";
import Audit from "./pages/admin/Audit";
import Order from "./pages/admin/Order";
import Product from "./pages/admin/Product";
import Reports from "./pages/admin/Reports";
import Dashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";
import CustomerForm from "./pages/admin/CustomerForm";

const CustomRouter = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<App />}>
                <Route path="panel/login" element={<Login />} />
                <Route path="panel/forgot-password" element={<ForgotPassword />} />
                <Route path="panel/reset-password" element={<ResetPassword />} />
                <Route path="panel/dashboard" element={<Dashboard />} />
                <Route path="panel/profile" element={<Profile />} />
                <Route path="panel/customers" element={<Customers />} />
                <Route path="panel/customers/:customerId" element={<Customer />} />
                <Route path="panel/customers/add" element={<CustomerForm />} />
                <Route path="panel/orders" element={<Orders />} />
                <Route path="panel/orders/:orderId" element={<Order />} />
                <Route path="panel/products" element={<Products />} />
                <Route path="panel/products/:productId" element={<Product />} />
                <Route path="panel/products/add" element={<ProductForm />} />
                <Route path="panel/products/edit/:productId" element={<ProductForm />} />
                <Route path="panel/inventory" element={<Inventory />} />
                <Route path="panel/roles" element={<Roles />} />
                <Route path="panel/roles/:roleId" element={<Role />} />
                <Route path="panel/panel-users" element={<PanelUsers />} />
                <Route path="panel/panel-users/:panelUserId" element={<PanelUser />} />
                <Route path="panel/reports" element={<Reports />} />
                <Route path="panel/audits" element={<Audits />} />
                <Route path="panel/audits/:auditId" element={<Audit />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default CustomRouter;
