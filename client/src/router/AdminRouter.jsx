import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "../pages/admin/Login";
import ForgotPassword from "../pages/admin/ForgotPassword";
import ResetPassword from "../pages/admin/ResetPassword";
import Profile from "../pages/admin/Profile";
import PanelUsers from "../pages/admin/PanelUsers";
import Roles from "../pages/admin/Roles";
import Customers from "../pages/admin/Customers";
import Audits from "../pages/admin/Audits";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Customer from "../pages/admin/Customer";
import PanelUser from "../pages/admin/PanelUser";
import Role from "../pages/admin/Role";
import Audit from "../pages/admin/Audit";
import Order from "../pages/admin/Order";
import Product from "../pages/admin/Product";
import Reports from "../pages/admin/Reports";
import Dashboard from "../pages/admin/Dashboard";
import ProductForm from "../pages/admin/ProductForm";
import CustomerForm from "../pages/admin/CustomerForm";
import Categories from "../pages/admin/Categories";
import adminPanelService from "../api/admin/api-admin";
import { login } from "../store/auth/adminAuthSlice";
import LoadingPage from "../components/Loading/Loading";
import AdminLayout from "../layout/AdminLayout";

const AdminRouter = () => {
    const [loading, setLoading] = useState(true);
    const loginStatus = useSelector((state) => state.adminAuth.status);
    const dispatch = useDispatch();

    useEffect(() => {
        adminPanelService
            .profile()
            .then(({ data }) => {
                if (data) {
                    dispatch(login(data.user));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    const adminRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/panel" element={<AdminLayout />}>
                {loginStatus ? (
                    <>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="customers/:customerId" element={<Customer />} />
                        <Route path="customers/add" element={<CustomerForm />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="orders/:orderId" element={<Order />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:productId" element={<Product />} />
                        <Route path="products/add" element={<ProductForm />} />
                        <Route path="products/edit/:productId" element={<ProductForm />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="roles/:roleId" element={<Role />} />
                        <Route path="panel-users" element={<PanelUsers />} />
                        <Route path="panel-users/:panelUserId" element={<PanelUser />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="audits" element={<Audits />} />
                        <Route path="audits/:auditId" element={<Audit />} />
                        <Route index element={<Navigate to="/panel/dashboard" />} />
                    </>
                ) : (
                    <>
                        <Route path="login" element={<Login />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password/:token" element={<ResetPassword />} />
                        <Route index element={<Navigate to="/panel/login" />} />
                    </>
                )}
                <Route path="*" element={<Navigate to={loginStatus ? "/panel/dashboard" : "/panel/login"} />} />
            </Route>
        )
    );

    return <RouterProvider router={adminRouter} />;
};

export default AdminRouter;
