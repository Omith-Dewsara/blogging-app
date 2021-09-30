import React, { useState, useEffect } from "react";
import "../styles/FriendsChatsContainer.css";
import { selectChatActive, setChatActive, selectActiveFriend } from "../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input } from "@mui/material";
import { BsBoxArrowInLeft } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import Message from "./FriendsMessage";
import FlipMove from "react-flip-move";
import { selectUser } from "../features/userSlice";

import { db } from "../firebase";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

function FriendsChatsContainer() {
	const chatActive = useSelector(selectChatActive);
	const dispatch = useDispatch();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const activeFriend = useSelector(selectActiveFriend);

	const user = JSON.parse(useSelector(selectUser));

	const addMessage = (e) => {
		e.preventDefault();
		if (activeFriend?.friend && user) {
			addDoc(collection(db, "messages", activeFriend?.friend?.messagesId, "messages"), {
				timestamp: serverTimestamp(),
				message: input,
				id: user.uid
			}).then(() => {
				setInput("");
			})
		}
	}

	useEffect(() => {
		if (activeFriend?.friend) {
			onSnapshot(query(collection(db, "messages", activeFriend.friend.messagesId, "messages"), orderBy("timestamp")), snapshot => {
				setMessages(snapshot.docs.map(doc => ({ id: doc.id, message: doc.data() })))
				const messagesContainer = document.querySelector(".friendsChatsContainer__messages");
				let xH = messagesContainer.scrollHeight;
		        messagesContainer.scrollTo(0, xH);
			})
		}
	}, [activeFriend])

	return (
		<div 
			className={`friendsChatsContainer ${chatActive && "friendsChatsContainerActive"}`}
		>
			<div 
				className="friendsChatsContainer__Header"
			>
				<Button
					onClick={() => dispatch(setChatActive())}
				>
					<BsBoxArrowInLeft />
				</Button>
				<div>
					<img 
						src={activeFriend?.friend?.pfp}
						alt=""
					/>
					<h3> 
						{ activeFriend?.friend?.name } 
					</h3>
				</div>
			</div>
			<div className="friendsChatsContainer__messages">
				<FlipMove>
					{
						messages.map(({id, message}) => (
							<Message
								key={id} 
								message={message.message}
								isMyMessage={message.id === user?.uid}
							/>
						))
					}
				</FlipMove>
				{
					!activeFriend?.friend?.name && (
						<h1> Select a friend to start texting... </h1>
					)
				}
			</div>
			<form className="friendsChatsContainer__footer">
				<Input 
					placeholder="type a message"
					value={input}
					onChange={e => setInput(e.target.value)}
				/>
				<Button
					color="primary"	
					variant="contained"
					type="submit"
					onClick={addMessage}
					disabled={!input.length || !activeFriend?.friend}
				> 
					<MdSend /> 
				</Button>
			</form>
		</div>
	)
}

export default FriendsChatsContainer;