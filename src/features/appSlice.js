import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	SearchValue: "",
	currentFriendsPage: "friends",
	activeFriend: {},
	chatActive: false,
	searchInputPlaceholder: "Search users",
	activeFriendId: ""
}

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setSearchValue: (state, action) => {
			state.SearchValue = action.payload;	
		},
		setCurrentFriendsPage: (state, action) => {
			state.currentFriendsPage = action.payload;
		},
		setActiveFriend: (state, action) => {
			state.activeFriend = action.payload;
		},
		setChatActive: (state, action) => {
			state.chatActive = !state.chatActive;
		},
		setSearchInputPlaceholder: (state, action) => {
			state.searchInputPlaceholder = action.payload;
		},
		setActiveFriendId: (state, action) => {
			state.activeFriendId = action.payload;
		}
	}
})

export const { setSearchValue, setCurrentFriendsPage, setActiveFriend , setChatActive, setSearchInputPlaceholder, setActiveFriendId } = appSlice.actions;
export const selectSearchValue = state => state.app.SearchValue;
export const selectCurrentFriendsPage = state => state.app.currentFriendsPage;
export const selectActiveFriend = state => state.app.activeFriend;
export const selectChatActive = state => state.app.chatActive;
export const selectSearchInputPlaceholder = state => state.app.searchInputPlaceholder;
export const selectActiveFriendId = state => state.app.activeFriendId

export default appSlice.reducer;