import { configureStore } from "@reduxjs/toolkit";
import adminAuthSlice from "./auth/adminAuthSlice";

const store = configureStore({
    reducer: {
        adminAuth: adminAuthSlice,
    },
});

export default store;
