import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/Home";
import PrivacyPolicy from "../pages/user/PrivacyPolicy";
import TermsAndConditions from "../pages/user/TermsAndConditions";
import ContactUs from "../pages/user/ContactUs";
import UserLogin from "../pages/user/UserLogin";
import UserRegister from "../pages/user/UserRegister";
import UserForgotPassword from "../pages/user/UserForgotPassword";
import UserResetPassword from "../pages/user/UserResetPassword";
import UserProfile from "../pages/user/UserProfile";
import UserOrders from "../pages/user/UserOrders";
import UserOrder from "../pages/user/UserOrder";
import userService from "../api/user/api";
import { userLogin } from "../store/auth/userAuthSlice";
import LoadingPage from "../components/Loading/Loading";

const UserRouter = () => {
    const [loading, setLoading] = useState(true);
    const loginStatus = useSelector((state) => state.adminAuth.status);
    const dispatch = useDispatch();

    useEffect(() => {
        userService
            .profile()
            .then(({ data }) => {
                if (data) {
                    dispatch(userLogin(data.user));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    const userRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                {loginStatus ? (
                    <>
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="orders" element={<UserOrders />} />
                        <Route path="order/:orderId" element={<UserOrder />} />
                    </>
                ) : (
                    <>
                        <Route path="login" element={<UserLogin />} />
                        <Route path="register" element={<UserRegister />} />
                        <Route path="forgot-password" element={<UserForgotPassword />} />
                        <Route path="reset-password/:token" element={<UserResetPassword />} />
                    </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        )
    );

    return <RouterProvider router={userRouter} />;
};

export default UserRouter;
