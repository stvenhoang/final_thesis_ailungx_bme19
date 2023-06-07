import { createSlice } from "@reduxjs/toolkit";

const predictSlice = createSlice({
    name: "predict",
    initialState: {
        getPredict: {
            currentPredict: null,
            isFetching: false,
            error: false,
        },
    },

    reducers: {
        //get predict
        getpredictStart: (state) => {
            state.getPredict.isFetching = true;
        },
        getpredictSuccess: (state, action) => {
            state.getPredict.isFetching = false;
            state.getPredict.currentPredict = action.payload;
            state.getPredict.error = false;
        },
        getpredictFailed: (state) => {
            state.getPredict.isFetching = false;
            state.getPredict.error = true;
        },
    }
});

export const {
    getpredictStart,
    getpredictFailed,
    getpredictSuccess
} = predictSlice.actions;

export default predictSlice.reducer;