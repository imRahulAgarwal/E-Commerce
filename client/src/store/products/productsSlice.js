import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newProducts: [],
    featuredProducts: [],
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setNewProducts: (state, action) => {
            state.newProducts = action.payload;
        },
        setFeaturedProducts: (state, action) => {
            state.featuredProducts = action.payload;
        },
    },
});

export const { setNewProducts, setFeaturedProducts } = productsSlice.actions;

export default productsSlice.reducer;
