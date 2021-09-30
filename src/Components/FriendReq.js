import React, { useState, useEffect } from "react";
import "../styles/FriendReq.css";
import { Card, Button, IconButton, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { BsFillPersonCheckFill, BsFillPersonDashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectSearchValue } from "../features/appSlice";
import { selectUser, selectUserInfo } from "../features/userSlice";

import { db } from "../firebase";
import { onSnapshot, collection, setDoc, doc, deleteDoc } from "firebase/firestore";

function FriendReq() {
	const [openAcceptFriendReq, setOpenAcceptFriendReq] = useState(false);
	const [openDesclineFriendReq, setOpenDeclineFriendReq] = useState(false);
	const inputValue = useSelector(selectSearchValue);
	const [friendReqests, setFriendRequests] = useState([]);

	const user = JSON.parse(useSelector(selectUser));
	const userInfo = JSON.parse(useSelector(selectUserInfo))

	useEffect(() => {
		if (user) {
			onSnapshot(collection(db, "users", user?.uid, "friendRequests"), snapshot => {
				setFriendRequests(snapshot.docs.map(doc => ({ id: doc.id, friendReq: doc.data() })))
			})
		}
	}, [user]);

	const Alert = React.forwardRef(function Alert(props, ref) {
  		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});

	const acceptFriendReq = (id, pfp, name) => {
		setDoc(doc(db, "users", user?.uid, "friends", id), {
			name: name,
			pfp: pfp,
			messagesId:  user?.uid + id 
		}).then(() => {
			setDoc(doc(db, "messages", user?.uid + id), {
				wcMsg: "message starts from here"
			}).then(() => {
				setDoc(doc(db, "users", id, "friends", user?.uid), {
					name: userInfo?.name,
					pfp: userInfo?.pfp,
					messagesId:  user?.uid + id
				}).then(() => {
					setOpenAcceptFriendReq(true);
					deleteDoc(doc(db, "users", user?.uid, "friendRequests", id))
				})
			})
		})
	}

	const declineFriendReq = (id) => {
		deleteDoc(doc(db, "users", user?.uid, "friendRequests", id)).then(() => {
			setOpenDeclineFriendReq(true)
		})
	}

	return ( 
		<div className="friendReq">
			{
				friendReqests.filter(user => {
					if (inputValue === "") {
						return user
					} else if (user.friendReq.name.toLowerCase().includes(inputValue.toLowerCase())) {
						return user
					}
				}).map(({id, friendReq}) => (
					<Card 
						key={id}
						className="friendReq__container"
					> 
						<img 
							src={friendReq?.pfp}
							alt=""
						/>
						<div className="friendReq__right">	
							<div>
								<h3> { friendReq.name } </h3>
								<p> 
									{ friendReq?.message }
								</p>
							</div>
							<div className="friendReq__right__desktopButtons">
								<Button
									color="success"
									onClick={() => acceptFriendReq(id, friendReq.pfp, friendReq.name)}
								> 
									<BsFillPersonCheckFill />
									Accept Friend Request 
								</Button>
								<Button
									color="error"
									onClick={() => declineFriendReq(id)}
								> 
									<BsFillPersonDashFill />
									Decline Friend Request 
								</Button>
							</div>
						</div> 
						<div className="friendReq__right__mobileButtons">
							<IconButton
								onClick={() => acceptFriendReq(id, friendReq.pfp, friendReq.name)}
							>
								<BsFillPersonCheckFill />
							</IconButton>
							<IconButton
								onClick={() => declineFriendReq(id)}
							>
								<BsFillPersonDashFill />
							</IconButton>
						</div>
					</Card>
				))
			}

			<Snackbar 
				open={openAcceptFriendReq} 
				autoHideDuration={6000} 
				onClose={e => setOpenAcceptFriendReq(false)}
			>
		        <Alert 
		        	onClose={e => setOpenAcceptFriendReq(false)} 
		        	severity="success" 
		        	sx={{ width: '100%' }}
		        >
		          You accpeted the friend request
		        </Alert>
      		</Snackbar>
      		<Snackbar 
				open={openDesclineFriendReq} 
				autoHideDuration={6000} 
				onClose={e => setOpenDeclineFriendReq(false)}
			>
		        <Alert 
		        	onClose={e => setOpenDeclineFriendReq(false)} 
		        	severity="error" 
		        	sx={{ width: '100%' }}
		        >
		          You declined the friend request
		        </Alert>
      		</Snackbar>
		</div>
	)
}

export default FriendReq;