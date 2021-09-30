import React, { useEffect, useState } from "react";
import "../styles/Blog.css";
import Navbar from "./Navbar";
import BlogPost from "./BlogPost";
import { useSelector } from "react-redux";
import { selectSearchValue } from "../features/appSlice";
import { selectUser } from "../features/userSlice";
import { CircularProgress } from "@mui/material";

import { db } from "../firebase";
import { onSnapshot, collection, doc, query, orderBy } from "firebase/firestore";
import friendsOnlySvg from "../assets/friends-only.svg";

function Blog({ isMe }) {
	const inputValue = useSelector(selectSearchValue);
	const [userId, setUserId] = useState('');
	const [userData, setUserData] = useState(null);
	const [blogPosts, setBlogPosts] = useState([]);

	const user = useSelector(selectUser);
	const [blogOwner, setBlogOwner] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [friendList, setFriendList] = useState([]);
	const [isFriend, setIsFriend] = useState(false);

	useEffect(() => {
		if (isMe) {
			if (!blogPosts) {
				setIsLoading(true);
			} else {
				setIsLoading(false);
			}
		} else {
			if (!blogOwner || !userData) {
				setIsLoading(true);
			} else {
				setIsLoading(false);
			}
		}
	}, [blogOwner, userData, isMe, blogPosts])

	useEffect(() => {
		setUserData(JSON.parse(user));
		if (!isMe) {
			const thePath = window.location.pathname
			const id = thePath.substring(thePath.lastIndexOf('/') + 1);

			onSnapshot(doc(db, "users", id), snapshot => {
				setBlogOwner(snapshot.data())
			})

		}
	}, [user, isMe])

	useEffect(() => {
		if (isMe) {
			if (userData) {
				onSnapshot(query(collection(db, "users", userData?.uid, "posts"), orderBy("timestamp", "desc")), snapshot => {
					setBlogPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
				})
			}
		} else {
			const thePath = window.location.pathname
			const id = thePath.substring(thePath.lastIndexOf('/') + 1);
			setUserId(thePath.substring(thePath.lastIndexOf('/') + 1))

			onSnapshot(query(collection(db, "users", id, "posts"), orderBy("timestamp", "desc")), snapshot => {
				setBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
			})
			onSnapshot(collection(db, "users", id, "friends"), snapshot => {
				setFriendList(snapshot.docs.map(doc => doc.id))
			})
		}
	}, [userData, isMe])

	useEffect(() => {
		if (userData) {
			const index = friendList.indexOf(userData?.uid)
			if (index >= 0) {
				setIsFriend(true);
			}
		}
	}, [friendList, userData]);


	return (
		<div className="blog">
			<Navbar />
			<h1> { isMe ? "Your Blog" : blogOwner?.name + "'s Blog" } </h1>
			<div className={`blog__loadingScreen ${!isLoading && 'blog__loadingScreenOver'}`}>
				<CircularProgress />
				<div> Loading... </div>
			</div>
			<div className="blog__container">
				{
					!isLoading && !isMe ? (
						<>
							{
								blogOwner?.whoCanSeeBlog === "everyone" || isFriend ? (
									<>
									{
										inputValue.length ? (
											blogPosts.filter(({id, post}) => post?.title?.toLowerCase().includes(inputValue.toLowerCase())).map(({id, post}) => (
					                    	  	<BlogPost 
					                    	  		key={id}	
					                    	  		id={id}
													title={post?.title}
													desc={post?.content}
													img={post?.mainImg}
													isMe={isMe}
													userId={userId}
												/>
					                 		))
										) : (
											blogPosts.map(({id, post}) => (
												<BlogPost 
													key={id}
													title={post?.title}
													desc={post?.content}
													isMe={isMe}
													id={id}
													userId={userId}
													img={post?.mainImg}
												/>
											))
										)
									}
									</>
								) : blogOwner?.whoCanSeeBlog === "myFriends" ? (
									<div className="blog__friendsOnlyErr">
										<img 
											src={friendsOnlySvg}
											alt=""
										/>
										<h1> You should be a friend to view this blog </h1>
									</div>
								) : (
									<div className="blog__friendsOnlyErr">
										<img 
											src={friendsOnlySvg}
											alt=""
										/>
										<h1> You don't have access to view the blog </h1>
									</div>
								)
							}
						</>
					) : !isLoading && (
						<>
							{
								inputValue.length ? (
									blogPosts.filter(({id, post}) => post?.title?.toLowerCase().includes(inputValue.toLowerCase())).map(({id, post}) => (
					                   	<BlogPost 
					                   		key={id}
					                    	id={id}
											title={post?.title}
											desc={post?.desc}
											isMe={isMe}
											img={post?.mainimg}
										/>
					                ))
									) : (
									blogPosts.map(({id, post}) => (
										<BlogPost 
											key={id}
											title={post?.title}
											desc={post?.content}
											id={id}
											isMe={isMe}
											userId={userId}
											img={post?.mainImg}
										/>
									))
								)
							}
						</>
					)
				}
			</div>
		</div>
	)
}

export default Blog;