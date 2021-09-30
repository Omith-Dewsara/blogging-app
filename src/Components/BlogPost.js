import React, { useState, useEffect } from "react";
import "../styles/BlogPost.css";
import { Card, CardMedia } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../features/userSlice";	

import { db } from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";


function BlogPost({ title, desc, isUserPost, id, isMe, userId, img }) {
	const subStr = (str) => {
		if (str?.length > 5000) {
			return	str?.substr(0, 500) + "..."
		} else {
			return str
		}
	}	
	const [userData, setUserData] = useState(null);

	const userInfo = JSON.parse(useSelector(selectUserInfo));

	useEffect(() => {
		if (isMe) {
			setUserData(userInfo)
		} else {
			onSnapshot(doc(db, "users", userId), snapshot => {
				setUserData(snapshot.data());
			})
		}	
	}, [isMe, userInfo, userId])

	const history = useHistory();

	const redirect = () => {
		if (isMe) {
			history.push(`/blogPost/${id}`);
		} else {
			history.push(`/blog/${userId}/blogPost/${id}`);
		}
	}

	return (
		<Card 
			className="blogPost"
			onClick={redirect}
		>
			<CardMedia
	          component="img"
	          image={img ? img : userData?.pfp}
	          alt="Can't load the image"
	          className="blogPost__left"
        	/>
        	<div className="blogPost__right">
        		<h2> { title } </h2>
				<p>
					{ subStr(desc) }
				</p>
        	</div>
		</Card>
	)
}

export default BlogPost;