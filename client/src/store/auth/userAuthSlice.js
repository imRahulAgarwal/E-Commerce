import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
};

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.status = true;
            state.user = action.payload;
        },
        userLogout: (state) => {
            state.status = false;
            state.user = null;
        },
    },
});

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;
