import React, { useState, useEffect } from "react";
import "../styles/CreateBlogPost.css";
import { Button, Input, FormControl, TextField, CircularProgress } from "@mui/material";
import { AiOutlineCloseCircle, AiFillCamera } from "react-icons/ai";
import { BsFilePost } from "react-icons/bs";	
import defaultMainImg from "../assets/main-img.jpg";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import { storage, db } from "../firebase";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useHistory } from "react-router-dom";

function CreateBlogPost() {
	const [images, setImages] = useState(null);
	const [mainImg, setMainImg] = useState(null);

	const [postContent, setPostContent] = useState('');
	const [postTitle, setPostTitle] = useState('');
	const [posting, setPosting] = useState(false);

	const [userData, setUserData] = useState(null);
	const user = useSelector(selectUser);

	const history = useHistory();

	useEffect(() => {
		setUserData(JSON.parse(user))
	}, [user])

	const handleChange = (e) => {
		console.log(e);
		if (e.target.files[0]) {
			setImages({ img: e.target.files[0], imgUrl: URL.createObjectURL(e.target.files[0])});
		}
	}

	const handleMainImg = (e) => {
		if (e.target.files[0]) {
			setMainImg({ img: e.target.files[0], imgUrl: URL.createObjectURL(e.target.files[0]) })
		}
	}

	const removeImg = (imageUrl) => {
		setImages(null)
	}


	const post = async () => {
		setPosting(true);
		if (mainImg) {
			const uploadTask = uploadBytesResumable(ref(storage, `${userData?.uid}/images/${mainImg.img.name}`), mainImg.img);
			uploadTask.on('state_changed',
				(snapshot) => {
					
			  	}, 
			  	(error) => {
			  		console.log(error)
			  	}, 
	  			() => {
			    	getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
			      	console.log('File available at', downloadURL);
					if (images) {
						uploadBytes(ref(storage, `${userData?.uid}/images/${images.img.name}`), images.img).then((snapshot) => {
				  			getDownloadURL(snapshot.ref).then(subImgUrl => {
				  				addDoc(collection(db, "users", userData.uid, "posts"), {
						      		title: postTitle,
						      		content: postContent,
						      		mainImg: downloadURL,
						      		subImg: subImgUrl,
						      		timestamp: serverTimestamp()
						      	}).then(() => {
						      		setMainImg(null)
						      		setImages(null)
						      		setPostContent('');
						      		setPostTitle('');
						      		setPosting(false);
						      		history.push("/blog");
						      	}) 
				  			})
						});
					} else {
				  		addDoc(collection(db, "users", userData.uid, "posts"), {
						    title: postTitle,
						    content: postContent,
						    mainImg: downloadURL,
						    timestamp: serverTimestamp()
						}).then(() => {
							setMainImg(null)
						    setImages(null)
						    setPostContent('');
						   	setPostTitle('');
						    setPosting(false);
						    history.push("/blog");
						})
				  	}
		    	});
	  		})
		} else if (images) {
			uploadBytes(ref(storage, `${userData?.uid}/images/${images.img.name}`), images.img).then((snapshot) => {
				getDownloadURL(snapshot.ref).then(downloadURL => {
				  	console.log("I am iterating this time")
				  	addDoc(collection(db, "users", userData.uid, "posts"), {
						title: postTitle,
						content: postContent,
						subImg: downloadURL,
						timestamp: serverTimestamp()
					}).then(() => {
						setMainImg(null);
						setImages(null);
						setPostContent('');
						setPostTitle('');
						setPosting(false);	
						history.push("/blog");
					})
				})
			})
		} else {
			addDoc(collection(db, "users", userData.uid, "posts"), {
				title: postTitle,
				content: postContent,
				timestamp: serverTimestamp()
			}).then(() => {
				setMainImg(null)
				setImages(null)
				setPostContent('');
				setPostTitle('');
				setPosting(false);
				history.push("/blog");
			})
		}
	}

	return (
		<div className="createBlogPost">
			<h1> <BsFilePost /> Add a new post </h1>
			<div className={`createBlogPost__posting ${!posting && 'createBlogPost__postingOver'}`}>
				<CircularProgress />
				<div> Uploading the post... </div>
			</div>
			<div className="createBlogPost__main">
				<div className="createBlogPost__mainImg">
					<img 
						src={mainImg ? mainImg.imgUrl : defaultMainImg}
						alt=""
					/>
					<div>
						<div> Add main image </div>
						<label htmlFor="contained-button-file-1" className="createBlogPost__addImg">
							<Input 
							  	accept="image/*" 
							  	id="contained-button-file-1" 
							  	multiple 
							  	type="file" 
							  	onChange={handleMainImg}
							/>
							<Button variant="contained" component="span">
							    <AiFillCamera style={{fontSize: "22px", marginRight: "10px"}}/> 
							    Add Image
							</Button>
						</label>
					</div>
				</div>

				<FormControl variant="outlined">
					<TextField
						placeholder="post title"
						className="createBlogPost__postTitle"
						value={postTitle}
						onChange={e => setPostTitle(e.target.value)}
					/>
				</FormControl>
				<textarea 
					placeholder="Post content"
					value={postContent}
					onChange={e => setPostContent(e.target.value)}
				>
					
				</textarea>
			</div>
			<label htmlFor="contained-button-file" className="createBlogPost__addImg">
				<Input 
				  	accept="image/*" 
				  	id="contained-button-file" 
				  	multiple 
				  	type="file" 
				  	onChange={handleChange}
				/>
				<Button variant="contained" component="span">
				    <AiFillCamera style={{fontSize: "22px", marginRight: "10px"}}/> 
				    Add an Image
				</Button>
			</label>
			<div className="createBlogPost__images">
				{
					images ? (
						<div>
							<img src={images.imgUrl} alt="No img" />
							<AiOutlineCloseCircle onClick={removeImg}/>
						</div>
					) : null
				}
			</div>
			<Button 
				variant="outlined" 
				className="createBlogPost__postButton"
				color="primary"
				onClick={post}
			> 
				Add Post 
			</Button>
		</div>
	)
}

export default CreateBlogPost;