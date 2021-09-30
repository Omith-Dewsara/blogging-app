import React, { useState, useEffect } from "react";
import "../styles/FriendsFriends.css";
import { Card, Button, IconButton, Snackbar } from "@mui/material";
import { BsFillPersonDashFill } from "react-icons/bs";
import { IoMdChatbubbles } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFriend, setChatActive, setCurrentFriendsPage, selectSearchValue } from "../features/appSlice";
import { selectUser } from "../features/userSlice";

import { db } from "../firebase";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

function FriendsFriends() {
	const dispatch = useDispatch();
	const inputValue = useSelector(selectSearchValue);
	const [open, setOpen] = useState(false);
	const [openMsg, setOpenMsg] = useState('');
	const [friends, setFriends] = useState([]);


	const user = JSON.parse(useSelector(selectUser));
	const history = useHistory();

	useEffect(() => {
		if (user) {
			onSnapshot(collection(db, "users", user?.uid, "friends"), snapshot => {
				setFriends(snapshot.docs.map(doc => ({ id: doc.id, friend: doc.data() })))
			})
		}
	}, [user])

	const chatSelectedUser = (id, friend) => {
		dispatch(setActiveFriend({ id, friend }))
		dispatch(setChatActive());
		dispatch(setCurrentFriendsPage('chats'))
	}

	const removeUser = (id) => {
		if (user && id) {
			setOpenMsg("removing the user");
			setOpen(true)
			deleteDoc(doc(db, "users", user?.uid, "friends", id)).then(() => {
				deleteDoc(doc(db, "users", id, "friends", user?.uid)).then(() => {
					deleteDoc(doc(db, "users", id, "friends", user?.uid)).then(() => {
						setOpenMsg("User removed")
					})
				})
			})
		} else {
			setOpenMsg("Sorry we are unable to remove the user. Please try again later");
			setOpen(true)
		}
	}

	const visitFriendPfp = (id) => {
		history.push(`/user/${id}`)
	}

	return (
		<div className="friendsFriends">
			{
				friends.filter(friend => {
					if (inputValue === "") {
						return friend
					} else if (friend.friend.name.toLowerCase().includes(inputValue.toLowerCase())) {
						return user;
					}					
				}).map(({id, friend}) => (
						<Card 
							className="friendsFriend"
							key={id}
						>
							<img 
								src={friend?.pfp}
								alt=""
								onClick={() => visitFriendPfp(id)}
							/>
							<div className="friendsFriend__right">
								<h3> { friend.name } </h3>
								<div className="friendsFriend__right__buttons">
									<Button 
										color="error"
										onClick={() => removeUser(id)}
									> 
										<BsFillPersonDashFill /> Remove friend 
									</Button>
									<Button
										onClick={() => chatSelectedUser(id, friend)}
									> 
										<IoMdChatbubbles /> Chat 
									</Button>
								</div>
								<div className="friendsFriend__right__mobileButtons">
									<IconButton
										onClick={() => chatSelectedUser(id, friend)}
									>
										<IoMdChatbubbles />
									</IconButton>
									<IconButton
										onClick={() => removeUser(id)}
									>
										<BsFillPersonDashFill />
									</IconButton>
								</div>
							</div>
						</Card>
					)
				)
			}
			<Snackbar
				open={open}
				onClose={() => setOpen(false)}
				message={openMsg}
      		/>
		</div>
	)
}

export default FriendsFriends;