import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
        },
    },
});

export const { login, logout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
