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
import ContactUs from "../pages/admin/ContactUs";
import ProtectedRoute from "../components/admin/ProtectedRoute/ProtectedRoute";

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
                        <Route
                            path="customers"
                            element={
                                <ProtectedRoute permission="manage_customer">
                                    <Customers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="customers/:customerId"
                            element={
                                <ProtectedRoute permission="manage_customer">
                                    <Customer />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="customers/add"
                            element={
                                <ProtectedRoute permission="manage_customer">
                                    <CustomerForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="orders"
                            element={
                                <ProtectedRoute permission="manage_order">
                                    <Orders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="orders/:orderId"
                            element={
                                <ProtectedRoute permission="manage_order">
                                    <Order />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="categories"
                            element={
                                <ProtectedRoute permission="manage_category">
                                    <Categories />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="products"
                            element={
                                <ProtectedRoute permission="manage_product">
                                    <Products />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="products/:productId"
                            element={
                                <ProtectedRoute permission="manage_product">
                                    <Product />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="products/add"
                            element={
                                <ProtectedRoute permission="manage_product">
                                    <ProductForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="products/edit/:productId"
                            element={
                                <ProtectedRoute permission="manage_product">
                                    <ProductForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="roles"
                            element={
                                <ProtectedRoute permission="manage_role">
                                    <Roles />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="roles/:roleId"
                            element={
                                <ProtectedRoute permission="manage_role">
                                    <Role />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="panel-users"
                            element={
                                <ProtectedRoute permission="manage_panel_user">
                                    <PanelUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="panel-users/:panelUserId"
                            element={
                                <ProtectedRoute permission="manage_panel_user">
                                    <PanelUser />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="reports"
                            element={
                                <ProtectedRoute permission="manage_report">
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="audits"
                            element={
                                <ProtectedRoute permission="manage_audit">
                                    <Audits />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="audits/:auditId"
                            element={
                                <ProtectedRoute permission="manage_audit">
                                    <Audit />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="contact-us"
                            element={
                                <ProtectedRoute permission="manage_query">
                                    <ContactUs />
                                </ProtectedRoute>
                            }
                        />
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
