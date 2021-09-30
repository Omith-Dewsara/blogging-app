import React, { useState } from "react";
import "../styles/Friends.css";
import Navbar from "./Navbar";
import { Button } from "@mui/material";
import { FaUserFriends } from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentFriendsPage, selectCurrentFriendsPage, setSearchInputPlaceholder } from "../features/appSlice";
import FriendsFriends from "./FriendsFriends";
import FriendsChats from "./FriendsChats";
import FriendReq from "./FriendReq";

function Friends() {
	const dispatch = useDispatch();
	const currentFriendsPage = useSelector(selectCurrentFriendsPage);
	const [mobileMenuActive, setMobileMenuActive] = useState(false);

	return (
		<div className="friends">
			<Navbar />
			<div className={`friends__optionBar ${mobileMenuActive && 'friends__activeOptionBar'}`}>
				<Button 
					onClick={() => {
						dispatch(setCurrentFriendsPage('friends'))
						setMobileMenuActive(!mobileMenuActive)
						dispatch(setSearchInputPlaceholder('Search Friends'))
					}}
					variant={currentFriendsPage === "friends" ? "contained" : "outlined"}
				> 
					<FaUserFriends /> My friends 
				</Button>
				<Button
					onClick={() => {
						dispatch(setCurrentFriendsPage('chats'))
						setMobileMenuActive(!mobileMenuActive)
						dispatch(setSearchInputPlaceholder('Search chats'))
					}}
					variant={currentFriendsPage === "chats" ? "contained" : "outlined"}
				> 
					<IoMdChatbubbles /> Chats 
				</Button>
				<Button
					onClick={() => {
						dispatch(setCurrentFriendsPage('friendReq'))
						setMobileMenuActive(!mobileMenuActive)
						dispatch(setSearchInputPlaceholder('Search Friend Requests'))
					}}
					variant={currentFriendsPage === "friendReq" ? "contained" : "outlined"}
				> 
					<BsFillPersonPlusFill /> Friend Requests 
				</Button>
			</div>
			<div 
				className="friends__mobileNavBar"
				onClick={e => setMobileMenuActive(!mobileMenuActive)}
			>
				<div> </div>
				<div> </div>
				<div> </div>
			</div>

			{
				currentFriendsPage === "friends" ? <FriendsFriends /> : currentFriendsPage === "chats" ? <FriendsChats /> : <FriendReq />
			}
		</div>
	)
}

export default Friends;