import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Button, IconButton, Fab, Modal, Backdrop, Box, Fade, Typography, Avatar, TextField, Snackbar } from "@mui/material";
import { FaUserFriends, FaBirthdayCake, FaFemale, FaMale } from "react-icons/fa";
import { AiFillSetting, AiOutlineFieldTime, AiOutlineUserAdd } from "react-icons/ai";
import { GiThreeFriends } from "react-icons/gi"
import { GoLocation } from "react-icons/go";
import { MdMessage } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchInputPlaceholder } from "../features/appSlice";
import altBackground from "../assets/alt-background.jpg";

import { db } from "../firebase";
import { onSnapshot, doc, setDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser, selectUserInfo } from "../features/userSlice";

function Home({ isMe }) {
	const user = useSelector(selectUser);
	const [open, setOpen] = useState(false);
	const [openMessage, setOpenMessage] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [userData, setUserData] = useState(null);
	const [userId, setUserId] = useState('');
	const [myFriends, setMyFriends] = useState([]);
	const [isFriend, setIsFriend] = useState(false);

	const [myAuthInfo, setMyAuthInfo] = useState(null);

	const userInfo = JSON.parse(useSelector(selectUserInfo));

	const style = {
	  position: 'absolute',
	  top: '50%',
	  left: '50%',
	  transform: 'translate(-50%, -50%)',
	  width: 400,
	  bgcolor: 'background.paper',
	  border: '2px solid #000',
	  boxShadow: 24,
	  p: 4,
	};

	useEffect(() => {
		setMyAuthInfo(JSON.parse(user))
	}, [user])

	const [friendReqMsg, setFriendReqMsg] = useState('');

	const sendFriendRequest = async (e) => {
		e.preventDefault();
		setMessage("Sending friend request...");
		setOpenMessage(true);
		const thePath = await window.location.pathname
		const userUid = await thePath.substring(thePath.lastIndexOf('/') + 1);
		setDoc(doc(db, "users", userUid, "friendRequests", myAuthInfo?.uid), {
			name: userInfo?.name,
			pfp: userInfo?.pfp,
			message: friendReqMsg 
		}).then(() => {
			setMessage("Friend request sent");
			setOpenMessage(true);
			setOpen(false)
		})
		.catch(err => {
			setMessage("Friend request sent");
			setOpenMessage(true);	
			setOpen(false)
		})

	}

	useEffect(() => {
		if (!isMe) {
			const thePath = window.location.pathname
			const userUid = thePath.substring(thePath.lastIndexOf('/') + 1);
			setUserId(userUid);
			onSnapshot(doc(db, "users", userUid), (snapshot) => {
				setUserData(snapshot.data())
			})
			if (myAuthInfo) {
				onSnapshot(collection(db, "users", myAuthInfo?.uid, "friends"), snapshot => {
					setMyFriends(snapshot.docs.map(doc => doc.id))
				})
			}
		} else {
			if (myAuthInfo) {
				onSnapshot(doc(db, "users", myAuthInfo.uid), (snapshot) => {
					setUserData(snapshot.data())
				})
			}
		}
	}, [myAuthInfo, isMe])

	useEffect(() => {
		if (myFriends.length) {
			const thePath = window.location.pathname
			const userUid = thePath.substring(thePath.lastIndexOf('/') + 1);
			const index = myFriends.indexOf(userUid)
			if (index >= 0) {
				setIsFriend(true);
			}
		}
	}, [myFriends])

	return (
		<div className="home">
			<Modal
		        open={open}
		        onClose={handleClose}
		        closeAfterTransition
		        BackdropComponent={Backdrop}
		        BackdropProps={{
		          timeout: 500,
		        }}
		      >
		        <Fade in={open}>
		          <Box sx={style} className="home__sendMsg">
		            <Typography className="home__sendMsg__header" variant="h6" component="h2">
			          	<Avatar 
			          		src={userData?.pfp}
			          		alt=""
			          	/>
		              Send a message to {userData?.name}
		            </Typography>

		            <form>
		            	<TextField 
		            		multiline
		            		rows={9}
		            		placeholder="Type your message to user name"
		            		value={friendReqMsg}
		            		onChange={e => setFriendReqMsg(e.target.value)}
		            	/>
		            	<Button 
		            		type="submit"
		            		onClick={sendFriendRequest}
		            	> 
		            		Send message 
		            	</Button>
		            </form>
		          </Box>
		        </Fade>
		    </Modal>

			<div className="home__top">
				<div 
					className="home__top__coverImg"
					style={{backgroundImage: `url(${userData?.coverImg ? userData.coverImg : altBackground })`}}
				>
					<Avatar 
						src={userData?.pfp}
						alt={userData?.name}
						className="home__topPfp"
					/>	
				</div>
			</div>
			<div className="home__main">
				{
					isMe && (
						<Link to="/friends">
							<Button 
								variant="text"
								onClick={e => dispatch(setSearchInputPlaceholder('Search Friends'))}
							> 
								Friends 
							</Button>
						</Link>
					)
				}
				{
					isMe && (
						<Link 
							to="/settings"
							onClick={e => dispatch(setSearchInputPlaceholder(''))}
						>
							<Button variant="text"> Settings </Button>
						</Link>
					)
				}
				<Link to={isMe ? "/blog" : `/blog/${userId}`}>
					<Button 
						variant="text"
						onClick={e => dispatch(setSearchInputPlaceholder('Search Blog'))}
					> 
						My Blog 
					</Button>
				</Link>
			</div>
			<div className="home__mobileMain">
				<Link to="/friends">
					<IconButton> <FaUserFriends /> </IconButton>
				</Link>
				<Link to="/settings">
					<IconButton> <AiFillSetting /> </IconButton>
				</Link>
				<Link to="/blog">
					<Button> My blog </Button>
				</Link>
			</div>
			<div className="home__footer">
				<h2 className={!userData ? 'home__userNameloading' : ""}> { userData?.name } </h2>
				<p className={!userData ? "footer__loadingAboutMe" : ""}>
					{ userData?.desc }
				</p>
				<div className={`home__footer__blogInfo ${!userData && 'home__footer__blogInfo--loading'}`}>
					{
						userData ? (
							<>
								<div> 
									<GoLocation /> 
									{ userData?.city && userData.city}, { " " }
									{ userData?.country ? userData.country : "Not mentioned" } 
								</div>
								<div> <AiOutlineFieldTime /> Since { userData?.created } </div>
								<div> <GiThreeFriends /> { userData?.followers } Followers </div>
								<div> <FaBirthdayCake /> { userData?.birthDay ? userData.birthDay : "Not mentioned" } </div>
								<div>
									{
										userData?.gender === "male" ? <> <FaMale /> Male </> : userData?.gender === "female" ? <> <FaFemale /> Female </> : null
									}
								</div>
							</>
						) : null
					}
				</div>

				{
					!isMe && (
						<div className="home__footer__buttons">
							{
								!isFriend && userData && (
									<>
										<Button onClick={sendFriendRequest}> 
											<AiOutlineUserAdd style={{fontSize: "20px", marginRight: "10px"}} /> 
											Send a friend request 
										</Button>
										<Button 
											onClick={handleOpen}
										> 
											<MdMessage style={{fontSize: "20px", marginRight: "10px"}}  /> 
											Send a Message 
										</Button>
									</>
								)
							}
						</div>
					)
				}
			</div>
			<Link to="/createBlogPost" className="add-blog-button" >
				<Fab 
					variant="contained" 
					color="primary" 
				> 
					+ 
				</Fab>
			</Link>
			<Snackbar
			  open={openMessage}
			  autoHideDuration={6000}
			  onClose={() => setOpenMessage(false)}
			  message={message}
			/>
		</div>
	)
}

export default Home;