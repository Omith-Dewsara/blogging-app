import React, { forwardRef } from "react";
import { Card } from "@mui/material";
import "../styles/FriendsMessage.css";

const FriendsMessage = forwardRef(({ isMyMessage, message }, ref) => {
	return (
		<Card className={`friendsMessage ${isMyMessage && "myMessage"}`} ref={ref}>
			<p> { message } </p>
		</Card>
	)
})

export default FriendsMessage;