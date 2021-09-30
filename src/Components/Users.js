import React, { useState, useEffect } from "react";
import "../styles/Users.css";
import User from "./User";
import { useSelector } from "react-redux";
import { selectSearchValue } from "../features/appSlice";

import { db } from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";

function Users() {
	const inputValue = useSelector(selectSearchValue);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		onSnapshot(collection(db, "users"), (snapshot) => {
			setUsers(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
		})
	}, [])

	console.log("users: ",users)

	return (
		<div className="users">
			<div className="users__container">
					{
	                    users?.filter((user) => {
		                    if (inputValue === "") {
		                      
		                    } else if (user?.data?.name.toLowerCase().includes(inputValue.toLowerCase())) {
		                      return user
		                    }
                  		}).map(({id, data}) => (
							<User 
								name={data.name}
								desc={data.desc}
								pfp={data.pfp}
								id={id}
								key={id}
							/>
                  		))
                  }
			</div>
		</div>
	)
}

export default Users;		