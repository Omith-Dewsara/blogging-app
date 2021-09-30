import React from "react";
import "../styles/User.css";
import { Card, CardMedia } from "@mui/material";

import { useDispatch } from "react-redux";
import { setSearchValue } from "../features/appSlice";
import { useHistory } from "react-router-dom";
import userCircle from "../assets/userCircle.png";

function User({ name, pfp, desc, id }) {

	const subStr = (str) => {
		return	str?.substr(0, 500) + "..."
	}

	const dispatch = useDispatch();
	const history = useHistory();

	const redirect = () => {
		dispatch(setSearchValue(""));
		history.push(`/user/${id}`);
	}

	return (
		<Card 
			className="blogPost"
			onClick={redirect}
		>
			<CardMedia
	          component="img"
	          image={pfp ? pfp : userCircle}
	          alt="No profile picture"
	          className="blogPost__left"
        	/>
        	<div className="blogPost__right">
        		<h2> { name } </h2>
				<p>
					{subStr(desc)}
				</p>
        	</div>
		</Card>
	)
}

export default User;