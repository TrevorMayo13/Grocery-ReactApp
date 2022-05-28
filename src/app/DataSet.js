import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    view: 'home',
    search: '',
    cart: [],
};

export const DataSet = createSlice({
    name: 'dataSet',
    initialState,
    reducers: {
        setView: (state, action) => {
            state.view = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
    },
});
//setters
export const { setSearch } = DataSet.actions;
export const { setView } = DataSet.actions;
export const { setCart } = DataSet.actions;
//getters
export const getSearch = (state) => state.dataSet.search;
export const getView = (state) => state.dataSet.view;
export const getCart = (state) => state.dataSet.cart;

export default DataSet.reducer;