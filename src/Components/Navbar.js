import React from "react";
import "../styles/Navbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { IconButton } from '@mui/material';
import { setSearchValue, selectSearchValue, selectSearchInputPlaceholder, setSearchInputPlaceholder } from "../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
	const inputValue = useSelector(selectSearchValue);
	const dispatch = useDispatch();
	const searchInputPlaceholder = useSelector(selectSearchInputPlaceholder);

	const handleChange = (e) => {
		dispatch(setSearchValue(e.target.value))
	}

	return (
		<div className="navbar">
			<div className="navbar__search">	
				<input 
					type="" 
					placeholder={searchInputPlaceholder}
					value={inputValue}
					onChange={handleChange}
					disabled={searchInputPlaceholder === ""}
				/>
				<button> <AiOutlineSearch /> </button>
			</div>

			<Link to="/">
				<IconButton onClick={() => dispatch(setSearchInputPlaceholder('Search users'))}>
					<MdAccountCircle className="navbar__accountIcon"/>
				</IconButton>
			</Link>
		</div>
	)
}

export default Navbar;