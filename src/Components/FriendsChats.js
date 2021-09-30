import React from "react";
import "../styles/FriendsChats.css";
import Sidebar from "./FriendsChatsSidebar";
import ChatContainer from "./FriendsChatsContainer";

function FriendsChat() {
	return (
		<div className="friendsChat">
			<Sidebar />
			<ChatContainer />
		</div>
	)
}


export default FriendsChat;