import React, { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/Home";
import UserLogin from "../pages/user/UserLogin";
import userService from "../api/user/api";
import { setAddresses, setUserCart, setUserWishlist, userLogin } from "../store/auth/userAuthSlice";
import Loader from "../components/Loader/Loader";
import Shop from "../pages/user/Shop";
import Product from "../pages/user/Product";
import { setFeaturedProducts, setNewProducts } from "../store/products/productsSlice";

const TermsAndConditions = React.lazy(() => import("../pages/user/TermsAndConditions"));
const PrivacyPolicy = React.lazy(() => import("../pages/user/PrivacyPolicy"));
const ContactUs = React.lazy(() => import("../pages/user/ContactUs"));
const UserRegister = React.lazy(() => import("../pages/user/UserRegister"));
const UserForgotPassword = React.lazy(() => import("../pages/user/UserForgotPassword"));
const UserResetPassword = React.lazy(() => import("../pages/user/UserResetPassword"));
const UserProfile = React.lazy(() => import("../pages/user/UserProfile"));
const UserOrders = React.lazy(() => import("../pages/user/UserOrders"));
const UserOrder = React.lazy(() => import("../pages/user/UserOrder"));
const Checkout = React.lazy(() => import("../pages/user/Checkout"));

const UserRouter = () => {
    const [loading, setLoading] = useState(true);
    const loginStatus = useSelector((state) => state.userAuth.status);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileResponse, newProductsResponse, featuredProductsResponse] = await Promise.all([
                    userService.profile(),
                    userService.newProducts(),
                    userService.featuredProducts(),
                ]);

                if (profileResponse.data) {
                    dispatch(userLogin(profileResponse.data.user));

                    const [addressesResponse, cartResponse, wishlistResponse] = await Promise.all([
                        userService.readAddresses(),
                        userService.readCartItems(),
                        userService.readWishlist(),
                    ]);

                    if (addressesResponse.data) {
                        dispatch(setAddresses(addressesResponse.data.addresses));
                    }
                    if (cartResponse.data) {
                        dispatch(setUserCart(cartResponse.data));
                    }
                    if (wishlistResponse.data) {
                        dispatch(setUserWishlist(wishlistResponse.data));
                    }
                }

                if (newProductsResponse.data) {
                    dispatch(setNewProducts(newProductsResponse.data.products));
                }

                if (featuredProductsResponse.data) {
                    dispatch(setFeaturedProducts(featuredProductsResponse.data.products));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [dispatch]);

    if (loading) {
        return <Loader classes="h-screen" />;
    }

    const userRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:productId" element={<Product />} />
                <Route
                    path="contact-us"
                    element={
                        <Suspense fallback={<Loader />}>
                            <ContactUs />
                        </Suspense>
                    }
                />
                <Route
                    path="privacy-policy"
                    element={
                        <Suspense fallback={<Loader />}>
                            <PrivacyPolicy />
                        </Suspense>
                    }
                />
                <Route
                    path="terms-and-conditions"
                    element={
                        <Suspense fallback={<Loader />}>
                            <TermsAndConditions />
                        </Suspense>
                    }
                />
                {loginStatus ? (
                    <>
                        <Route
                            path="profile"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserProfile />
                                </Suspense>
                            }
                        />
                        <Route
                            path="orders"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserOrders />
                                </Suspense>
                            }
                        />
                        <Route
                            path="order/:orderId"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserOrder />
                                </Suspense>
                            }
                        />
                        <Route
                            path="checkout"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <Checkout />
                                </Suspense>
                            }
                        />
                    </>
                ) : (
                    <>
                        <Route path="login" element={<UserLogin />} />
                        <Route
                            path="register"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserRegister />
                                </Suspense>
                            }
                        />
                        <Route
                            path="forgot-password"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserForgotPassword />
                                </Suspense>
                            }
                        />
                        <Route
                            path="reset-password/:token"
                            element={
                                <Suspense fallback={<Loader />}>
                                    <UserResetPassword />
                                </Suspense>
                            }
                        />
                    </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        )
    );

    return <RouterProvider router={userRouter} />;
};

export default UserRouter;
