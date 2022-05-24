import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    view: 'home'
};

export const DataSet = createSlice({
    name: 'dataSet',
    initialState,
    reducers: {
        setView: (state, action) => {
            console.log(action.payload);
            state.view = action.payload;
        },
    },
});
//setters
export const { setView } = DataSet.actions;
//getters
export const getView = (state) => state.dataSet.view;

export default DataSet.reducer;