import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import DataSet from './DataSet';

export const store = configureStore({
  reducer: {
    dataSet: DataSet,
    counter: counterReducer
  },
});
