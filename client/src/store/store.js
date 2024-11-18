import { configureStore } from "@reduxjs/toolkit";
import adminAuthSlice from "./auth/adminAuthSlice";
import userAuthSlice from "./auth/userAuthSlice";

const store = configureStore({
    reducer: {
        adminAuth: adminAuthSlice,
        userAuth: userAuthSlice,
    },
});

export default store;
