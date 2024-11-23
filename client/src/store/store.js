import { configureStore } from "@reduxjs/toolkit";
import adminAuthSlice from "./auth/adminAuthSlice";
import userAuthSlice from "./auth/userAuthSlice";
import productsSlice from "./products/productsSlice";

const store = configureStore({
    reducer: {
        adminAuth: adminAuthSlice,
        userAuth: userAuthSlice,
        products: productsSlice,
    },
});

export default store;
