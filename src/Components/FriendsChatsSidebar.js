import React, { useState, useEffect } from "react";
import "../styles/FriendsChatsSidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { setActiveFriend, selectActiveFriend, setChatActive, selectSearchValue, setSearchValue } from "../features/appSlice";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";

function FriendsChatsSidebar() {
	const dispatch = useDispatch();
	const activeFriend = useSelector(selectActiveFriend);
	const inputValue = useSelector(selectSearchValue);
	const user = JSON.parse(useSelector(selectUser));

	const [friends, setFriends] = useState([]);

	useEffect(() => {
		if (user) {
			onSnapshot(collection(db, "users", user?.uid, "friends"), snapshot => {
				setFriends(snapshot.docs.map(doc => ({ id: doc.id, friend: doc.data() })))
			})
		}
	}, [user])

	return (
		<div className="friendsChatsSidebar">
			{
				friends.filter(friend => {
					if (inputValue === "") {
						return friend
					} else if (friend.friend.name.toLowerCase().includes(inputValue.toLowerCase())) {
						return friend
					}
				}).map(({id, friend}) => (
					<div 
						className="friendsChatsSidebar__friend"
						onClick={() => {
							dispatch(setActiveFriend({id, friend}));
							dispatch(setChatActive());
							dispatch(setSearchValue(""));
						}}
						key={id}
					>
						<div 
							className={activeFriend?.id === id ? "friendsChatsSidebar__friendActive" : ""}
						> 
						</div>
						<img 
							src={friend.pfp}
							alt=""
						/>
						<div className="friendsChatsSidebar__friend__right">
							<h3> { friend.name } </h3>
						</div>
					</div>
				))
			}
		</div>
	)
}

export default FriendsChatsSidebar;