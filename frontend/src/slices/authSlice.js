import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const userInfo = action.payload;
            state.userInfo = userInfo;
            localStorage.setItem('user', JSON.stringify(state.userInfo))
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem('user');
        }
    }
})

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;