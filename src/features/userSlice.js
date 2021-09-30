import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	userInfo: null
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setUserInfo: (state, action) => {
			state.userInfo = action.payload;
		}
	} 
})

export const { setUser, setUserInfo } = userSlice.actions;
export const selectUser = state => state.user.user;
export const selectUserInfo = state => state.user.userInfo;

export default userSlice.reducer;