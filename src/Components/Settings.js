import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import Navbar from "./Navbar";
import { AiFillSetting, AiFillCamera, AiFillSave } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { Button, Input, FormControl, TextField, FormHelperText, Fab, Select, MenuItem, CircularProgress, Avatar, Checkbox } from "@mui/material";
import altBackground from "../assets/alt-background.jpg";

import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice"; 
import { signOut } from "firebase/auth";

function Settings() {
	const [userName, setUserName] = useState('');
	const [aboutMe, setAboutMe] = useState('');
	const [cName, setCName] = useState('');
	const [birthDay, setBirthDay] = useState('');
	const [gender, setGender] = useState('male');
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	
	const [userData, setUserData] = useState(null)
	const [userInfo, setUserInfo] = useState(null);
	const [saving, setSaving] = useState(false);
 	const [savingMsg, setSavingMsg] = useState('Saving changes...')
 	const [savingMsgTwo, setSavingMsgTwo] = useState('');

	const [pfp, setPfp] = useState(null);
	const [pfpCover, setPfpCover] = useState(null);
 	const [selectedCoverProfile, setSelectedCoverProfile] = useState(null);
 	const [selectedPfp, setSelectedPfp] = useState(null);

 	const [everyone, setEveryone] = useState(false);
	const [me, setMe] = useState(false);
	const [myFriends, setMyFriends] = useState(false);
	const [whoCanSeeBlog, setWhoCanSeeBlog] = useState('');

	const user = useSelector(selectUser);

	useEffect(() => {
		setUserData(JSON.parse(user))
	}, [user])

	useEffect(() => {
		if (userData) {
			onSnapshot(doc(db, "users", userData?.uid), (snapshot) => {
				setUserInfo(snapshot.data())
			})
		}
	}, [userData])

	useEffect(() => {
		if (userInfo) {
			setUserName(userInfo.name);
			setAboutMe(userInfo?.desc ? userInfo?.desc : "");
			setCName(userInfo?.cName ? userInfo?.cName : "");
			setBirthDay(userInfo?.birthDay ? userInfo?.birthDay : "");
			setCountry(userInfo?.country ? userInfo?.country : "");
			setCity(userInfo?.city ? userInfo?.city : "");
			setGender(userInfo?.gender ? userInfo?.gender : "")		

			switch(userInfo?.whoCanSeeBlog) {
				case 'me':
					setWhoCanSeeBlog('me');
					setMe(true);
					setMyFriends(false);
					setEveryone(false);
					break;
				case 'everyone':
					setWhoCanSeeBlog('everyone');
					setEveryone(true);
					setMe(false);
					setMyFriends(false);
					break;
				case 'myFriends':
					setWhoCanSeeBlog('myFriends');
					setMyFriends(true);
					setEveryone(false);
					setMe(false);
					break;
				default:
					setWhoCanSeeBlog('everyone');
					setEveryone(true);
					setMe(false);
					setMyFriends(false);
			}
		}			
	}, [userInfo])

	const saveProfile = () => {
		setSaving(true)
		updateDoc(doc(db, "users", userData.uid), {
			name: userName,
			desc: aboutMe,
			birthDay,
			cName,
			gender,
			country,
			city,
			whoCanSeeBlog
		}).then(async () => {
			if (selectedCoverProfile || selectedPfp) {
				if (selectedCoverProfile) {
					const uploadTask = uploadBytesResumable(ref(storage, `${userData.uid}/backgroundPfp`), pfpCover)
					uploadTask.on('state_changed', 
						(snapshot) => {
							const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						    setSavingMsg(`Saving the cover background ${Math.round(progress)}%`)
						},
						(error) => {
						    // Handle unsuccessful uploads
						    setSaving(false);
						    setSavingMsg('Saving Changes...');
						    setSelectedCoverProfile(null);
						  }, 
						  () => {
						    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						      updateDoc(doc(db, "users", userData.uid), {
						      	coverImg: downloadURL
						      })
						      setSelectedCoverProfile(null);
						      if (!selectedPfp) {
						      	setSaving(false);
						      	setSavingMsg('Saving Changes...');
						      }
						    });
						  }
					)
				}

				if (selectedPfp) {
					const uploadTask = uploadBytesResumable(ref(storage, `${userData.uid}/pfp`), pfp)
					uploadTask.on('state_changed', 
						(snapshot) => {
							const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						    setSavingMsgTwo(`Saving the new profile picture ${Math.round(progress)}%`)
						},
						(error) => {
						    // Handle unsuccessful uploads
						    setSaving(false);
						    setSavingMsgTwo('');
						    setSelectedPfp(null)
						  }, 
						  () => {	
						    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						      updateDoc(doc(db, "users", userData.uid), {
						      	pfp: downloadURL
						      })
						      setSaving(false);
						      setSavingMsgTwo('')
						      setSelectedPfp(null)
						    });
						  }
					)
				}
			} else {
				setSaving(false);
			}
		})

	}

	const updateCoverPfp = (e) => {
		setPfpCover(e.target.files[0]);
		setSelectedCoverProfile(URL.createObjectURL(e.target.files[0]));
	}

	const updateProfile = (e) => {
		setSelectedPfp(URL.createObjectURL(e.target.files[0]))
		setPfp(e.target.files[0])
	}
	const logOut = () => {
		signOut(auth)
	}

	const setWhoCanSee = (type) => {
		switch(type) {
			case 'me':
				setWhoCanSeeBlog('me');
				setMe(true);
				setMyFriends(false);
				setEveryone(false);
				break;
			case 'everyone':
				setWhoCanSeeBlog('everyone');
				setEveryone(true);
				setMe(false);
				setMyFriends(false);
				break;
			case 'myFriends':
				setWhoCanSeeBlog('myFriends');
				setMyFriends(true);
				setEveryone(false);
				setMe(false);
				break;
			default:
				setWhoCanSeeBlog('everyone');
				setEveryone(true);
				setMe(false);
				setMyFriends(false);
		}
	}

	return (
		<div className="settings">
			<Navbar />
			<div className={!userInfo ? "settings__loading" : "settings__loadingOver"}>
				<CircularProgress />
				<div> Loading... </div>
			</div>
			<div className={saving ? "settings__saving" : "settings__savingOver"}>
				<CircularProgress />
				<div> { savingMsg } </div>
				{ savingMsgTwo.length ? <div> { savingMsgTwo } </div> : null }
			</div>
			<div className="settings__container">
				<h1> <AiFillSetting /> Settings </h1>
				<div 
					className="settings__header"
					style={{backgroundImage: `url(${ selectedCoverProfile ? selectedCoverProfile : userInfo?.coverImg ? userInfo.coverImg : altBackground})`}}
				>
					<label htmlFor="edit-cover-img" className="settings__headerEditIcon">
		  				<Input 
		  					accept="image/*" 
		  					id="edit-cover-img" 
		  					multiple 
		  					type="file" 
		  					style={{display: "none"}} 
		  					onChange={updateCoverPfp}
		  				/>
						<Button component="span">
							<MdModeEdit />
						</Button>
					</label>
				
					<div>
						<Avatar 
							src={
								selectedPfp ? selectedPfp : userInfo?.pfp 
							} 
							alt="" 
							className="settings__headerPfp"
						/>
						<label htmlFor="edit-pfp">
							<div>
								<AiFillCamera />
							</div>
							<input 
								accept="image/*" 
							  	id="edit-pfp" 
							  	multiple 
							  	type="file" 
							  	onChange={updateProfile}
							/>
						</label>
					</div>
				</div>

				<div className="settings__editPfpButton__container">
					<label htmlFor="edit-pfp" className="settings__editPfpButton">
	  					<Button variant="text" component="span">
	    					Edit profile picture
	  					</Button>
					</label>
				</div>

				<div className="settings__main">
					<FormControl>
						<TextField 
							label="user name"
							variant="standard"
							value={userName}
							onChange={e => setUserName(e.target.value)}
						/>
						<FormHelperText> 3 minimum characters </FormHelperText>
					</FormControl>
					<FormControl>
						<TextField 
							label="About me"
							variant="outlined"
							value={aboutMe}
							onChange={e => setAboutMe(e.target.value)}
							multiline
						/>
						<FormHelperText> Maximum 200 characters </FormHelperText>
					</FormControl>
					<TextField 
						label="Cname"
						variant="standard"
						value={cName}
						onChange={e => setCName(e.target.value)}
					/>
					<FormControl>
					<label> Birth day </label>
						<TextField 
							variant="outlined"
							type="date"
							value={birthDay}
							onChange={e => setBirthDay(e.target.value)}
						/>
					</FormControl>
					<FormControl>
						<label htmlFor="settings-gender"> Gender </label>
						<Select
							value={gender}
							onChange={e => setGender(e.target.value)}
							id="settings-gender"
						>
							<MenuItem value="male"> Male </MenuItem>
							<MenuItem value="female"> Female </MenuItem>
						</Select>
					</FormControl>
					<TextField 
						label="Country"
						variant="standard"
						value={country}
						onChange={e => setCountry(e.target.value)}
					/>
					<TextField 
						label="City"
						variant="standard"
						value={city}
						onChange={e => setCity(e.target.value)}
					/>
				</div>
			</div>
			<Fab 
				variant="contained" 
				color="primary" 
				className="add-blog-button"
				onClick={saveProfile}
			> 
				<AiFillSave />
			</Fab>
			<div className="settings__advancedSettings">
				<h2> Advanced settings </h2>
				<h3> Who can see my blog? </h3>
				<div className="settings__advancedSettings__option">
					<tr>
						<td> Everyone </td>
						<td> 
							<Checkbox 
								name="me"
								onChange={() => setWhoCanSee('everyone')}
								checked={everyone}
							/> 
						</td>
					</tr>
					<tr>
						<td> Only me </td>
						<td> 
							<Checkbox 
								name="me"
								onChange={() => setWhoCanSee('me')}
								checked={me}
							/> 
						</td>
					</tr>
					<tr>
						<td> My friends </td>
						<td> 
							<Checkbox 
								name="me"
								onChange={() => setWhoCanSee('myFriends')}
								checked={myFriends}
							/> 
						</td>
					</tr>
				</div>
				<div className="settings__advancedSettings__buttons">
					<Button 
						variant="outlined"
						color="primary"
						onClick={logOut}
					>
						Log out
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Settings;