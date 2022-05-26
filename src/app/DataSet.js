import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    view: 'home',
    search: '',
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
    },
});
//setters
export const { setSearch } = DataSet.actions;
export const { setView } = DataSet.actions;
//getters
export const getSearch = (state) => state.dataSet.search;
export const getView = (state) => state.dataSet.view;

export default DataSet.reducer;