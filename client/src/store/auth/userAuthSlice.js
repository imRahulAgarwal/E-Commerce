import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
    cart: [],
    wishlist: [],
    addresses: [],
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
            state.addresses = [];
            state.wishlist = [];
            state.cart = [];
        },
        setUserCart: (state, action) => {
            state.cart = action.payload;
        },
        setUserWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
    },
});

export const { userLogin, userLogout, setUserCart, setUserWishlist, setAddresses } = userAuthSlice.actions;

export default userAuthSlice.reducer;
