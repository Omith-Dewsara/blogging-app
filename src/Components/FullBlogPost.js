import React, { useState, useEffect } from "react";
import "../styles/FullBlogPost.css";
import Navbar from "./Navbar";
import { Button, Fab, Input } from "@mui/material";
import { Link } from "react-router-dom";

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser, selectUserInfo } from "../features/userSlice";

import { db } from "../firebase";
import { onSnapshot, collection, doc, query, orderBy, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

const styles = {
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

function FullBlogPost({ isMe }) {
	const [currentNum, setCurrentNum] = useState(1);
	const [open, setOpen] = useState(false);
	const [blogPostData, setBlogPostData] = useState(null);
	const [allBlogPosts, setAllBlogPosts] = useState([]);
	const [postComments, setPostComments] = useState([]);

	const history = useHistory();
	const user = useSelector(selectUser);
	const userInfo = JSON.parse(useSelector(selectUserInfo))
	const [userData, setUserData] = useState(null);


	useEffect(() => {
		setUserData(JSON.parse(user));
	}, [user])

	const nextBlogPost = () => {
		if (currentNum < allBlogPosts?.length) {
			if (isMe) {
				setBlogPostData(null);
				history.push(`/blogPost/${allBlogPosts[currentNum]?.id}`);
			} else {
				setBlogPostData(null);
				const userId = window.location.pathname.split('/')[2];
				history.push(`/blog/${userId}/blogPost/${allBlogPosts[currentNum]?.id}`)
			}
		}
	}

	const prevBlogPost = () => {
		if (currentNum > 1) {
			if (isMe) {
				setBlogPostData(null)
				history.push(`/blogPost/${allBlogPosts[currentNum - 2]?.id}`);
			} else {
				setBlogPostData(null);
				const userId = window.location.pathname.split('/')[2];
				history.push(`/blog/${userId}/blogPost/${allBlogPosts[currentNum - 2]?.id}`)
			}
		} 
	}

	const deletePost = async () => {
		setOpen(false);
		if (isMe) {
			const thePath = await window.location.href;
			const postId = await thePath.substring(thePath.lastIndexOf('/') + 1);
			setBlogPostData(null)
			history.push(`/blogPost/${allBlogPosts[currentNum - 2]?.id}`);
			deleteDoc(doc(db, "users", userData?.uid, "posts", postId))
		}
	}

	useEffect(() => {
		if (isMe) {
			const getBlogData = async () => { 
				const thePath = await window.location.href;
				const postId = await thePath.substring(thePath.lastIndexOf('/') + 1);
				if (userData) {
					onSnapshot(query(collection(db, "users", userData?.uid, "posts"), orderBy("timestamp")), snapshot => {
						setAllBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
					})
					onSnapshot(query(collection(db, "users", userData.uid, "posts", postId, "comments"), orderBy("timestamp", "desc")), snapshot => {
						setPostComments(snapshot.docs.map(doc => ({id: doc.id, comment: doc.data()})))
					})
				}
				setCurrentNum(parseInt(postId))
			}
			getBlogData();
		} else {
			const getUsersBlogData = async () => {
				const thePath = await window.location.href;
				const postNumber = await thePath.substring(thePath.lastIndexOf('/') + 1);
				const userId = window.location.pathname.split('/')[2];
				onSnapshot(query(collection(db, "users", userId, "posts"), orderBy("timestamp")), snapshot => {
					setAllBlogPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
				})
				onSnapshot(query(collection(db, "users", userId, "posts", postNumber, "comments"), orderBy("timestamp", "desc")), snapshot => {
						setPostComments(snapshot.docs.map(doc => ({id: doc.id, comment: doc.data()})))
				})
			}

			getUsersBlogData()
		}
	}, [userData, isMe, window.location.href])

	useEffect(() => {
		const getBlogPost = async () => {
			if (allBlogPosts.length) {
				const thePath = await window.location.href;
				const postId = await thePath.substring(thePath.lastIndexOf('/') + 1);
				const index = allBlogPosts.findIndex(
					({id, post}) => id === postId
				)
				if (index >= 0) {
					setBlogPostData(allBlogPosts[index])
					setCurrentNum(index + 1);
				}
			}
		}
		getBlogPost()
	}, [allBlogPosts, window.location.href])

	const [input, setInput] = useState('');

	const addComment = async (e) => {
		e.preventDefault();
		if (isMe) {
			const thePath = await window.location.href;
			const postId = await thePath.substring(thePath.lastIndexOf('/') + 1);
			addDoc(collection(db, "users", userData?.uid, "posts", postId, "comments"), {
				pfp: userInfo?.pfp,
				name: userInfo?.name,
				comment: input,
				timestamp: serverTimestamp()
			}).then(() => {
				setInput("");
			})
		} else {
			const thePath = await window.location.href;
			const postId = await thePath.substring(thePath.lastIndexOf('/') + 1);
			const userId = window.location.pathname.split('/')[2];
			addDoc(collection(db, "users", userId, "posts", postId, "comments"), {
				pfp: userInfo?.pfp,
				name: userInfo?.name,
				comment: input,
				timestamp: serverTimestamp()
			}).then(() => {
				setInput("");
			})
		}
	}

	return (
		<div className="fullBlogPost">
					<Modal
		        aria-labelledby="transition-modal-title"
		        aria-describedby="transition-modal-description"
		        open={open}
		        onClose={() => setOpen(false)}
		        closeAfterTransition
		        BackdropComponent={Backdrop}
		        BackdropProps={{
		          timeout: 500,
		        }}
		      >
		        <Fade in={open}>
		          <Box sx={styles}>
		            <Typography id="transition-modal-title" variant="h6" component="h2">
		              Are you sure you need to delete this post?
		            </Typography>
		            <div className="delete-post-buttons">
		            	<Button 
		            		color="error"
		            		onClick={deletePost}
		            	> 
		            		DELETE THE POST 
		            	</Button>
		            	<Button onClick={e => setOpen(false)}> CANCEL </Button>
		            </div>
		          </Box>
		        </Fade>
		    </Modal>

			<Navbar />
			<div className="fullBlogPost__content">
				<h1 className={blogPostData ? "" : "fullBlogPost__title--loading"}> {currentNum}. { blogPostData?.post?.title } </h1>
				<div className={blogPostData ? "fullBlogPost--loadingOver" : "fullBlogPost__mainImg--loading"}> </div>
				{
					blogPostData?.post?.mainImg && (
						<img 
							src={blogPostData.post.mainImg}
							alt=""
							className="fullBlogPost__mainImg"
						/>
					)
				}
				<p className={blogPostData ? "" : "fullBlogPost__content--loading"}>
					{ blogPostData?.post?.content }
				</p>

				<div className="fullBlogPost__images">
						{
							blogPostData?.post?.subImg && (
								<img 
									src={blogPostData?.post?.subImg}
									alt=""
								/>
							)
						}
				</div>
				
				<div className={blogPostData ? "fullBlogPost--loadingOver" : "fullBlogPost__mainImg--loading"}> </div>

				<div className="fullBlogPost__buttons">
					{
						isMe && (
							<Button 
								variant="outlined" 
								color="error"
								onClick={() => setOpen(true)}
							> 
								Delete Post 
							</Button>
						)
					}
				</div>
				<div className="fullBlogPost__Postbuttons">
					<Button 
						onClick={prevBlogPost}
						disabled={currentNum === 1}
					> 
						{"<"}
					</Button>
						<Button> { currentNum } </Button>
					<Button onClick={nextBlogPost}> {">"} </Button>
				</div>
			</div>
			
			<Link to="/createBlogPost">
				<Fab color="primary" className="add-blog-button"> + </Fab>
			</Link>

			<h2> Comments </h2>
			<div className="fullBlogPost__comments">
				{
					postComments.map(({id, comment}) => (
						<div 
							key={id}
							className="fullBlogPost__comment"
						> 
							<img 
								src={comment?.pfp}
								alt=""
							/>
							<div className="fullBlogPost__comment__right">
								<div> {comment.name} </div>
								<p> {comment.comment} </p>
							</div>
						</div>
					))
				}
			</div>
			<form className="fullBlogPost__commentForm">
				<Input 
					type="text" 
					placeholder="write a comment"
					value={input}
					onChange={e => setInput(e.target.value)}
				/>
				<Button 
					variant="contained" 
					color="primary"
					type="submit"
					onClick={addComment}
					disabled={!input}
				> 
					Post 
				</Button>
			</form>
		</div>
	)
}

export default FullBlogPost;