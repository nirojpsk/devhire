import { createSlice } from "@reduxjs/toolkit";

const USER_INFO_KEY = 'userInfo';
const LEGACY_USER_INFO_KEY = 'user';

const persistedUserInfo =
    localStorage.getItem(USER_INFO_KEY) || localStorage.getItem(LEGACY_USER_INFO_KEY);

const initialState = {
    userInfo: persistedUserInfo ? JSON.parse(persistedUserInfo) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const userInfo = action.payload;
            state.userInfo = userInfo;
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(state.userInfo));
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem(USER_INFO_KEY);
            localStorage.removeItem(LEGACY_USER_INFO_KEY);
        }
    }
})

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
