import React, { useState } from "react";
import { TextField, FormControl, Button, Select, MenuItem, FormHelperText, Snackbar } from "@mui/material";
import "../styles/Auth.css";
import loginSvg from "../assets/login.svg";
import { auth, db } from "../firebase";
import MuiAlert from '@mui/material/Alert';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Auth() {
	const [isSignIn, setIsSignIn] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [gender, setGender] = useState('gender');

	const [open, setOpen] = useState(false);

	//Error messages
	const [emailErr, setEmailErr] = useState('');
	const [nameErr, setNameErr] = useState('');
	const [passwordErr, setPasswordErr] = useState('');
	const [genderErr, setGenderErr] = useState('');

	const [signInEmailErr, setSignInEmailErr] = useState('');
	const [signInPasswordErr, setSignInPasswordErr] = useState('');

	const [otherErrors, setOtherErrors] = useState();

	const signupUser = (e) => {
		e.preventDefault();
		//setting error
		if (email === "") {
			setEmailErr('Please enter the email address')
		}
		if (fullName === "") {
			setNameErr("Please enter your name")
		}
		if (password === "") {
			setPasswordErr("Please eneter a password")
		}
		if (gender === "gender") {
			setGenderErr("Please select your gender");
		}

		//removing error
		if (email.length) {
			setEmailErr("")
		}
		if (fullName.length) {
			setNameErr("")
		}
		if (password.length) {
			setPasswordErr("")
		}
		if (password === confirmedPassword && password.length) {
			setPasswordErr("")
		}
		if (gender !== "gender") {
			setGenderErr("")
		}

		if (password !== confirmedPassword) {
			setPasswordErr("Passwords doesn't match")
		}

		if (email.length && password.length && gender.length && fullName.length && password === confirmedPassword) {
			createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
				const date = new Date();				
				setDoc(doc(db, "users", userCred.user.uid), {
					name: fullName,
					gender: gender,
					created: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
					setWhoCanSeeBlog: 'everyone'
				})
			})
			.catch(err => {
				setOtherErrors(err.message);
				setOpen(true);
			})
		}

	}

	const signInUser = (e) => {
		e.preventDefault();
		if (email === "") {
			setSignInEmailErr("Please enter the email address");
		}
		if (password === "") {
			setSignInPasswordErr("Please enter the password");
		}

		if (email.length) {
			setSignInEmailErr("")
		}
		if (password.length) {
			setSignInPasswordErr("");
		}

		if (email.length && password.length) {
			signInWithEmailAndPassword(auth, email, password).then(userCred => {
			})	
		}
	}

	return (
		<div className="auth">
			{
				!isSignIn ? (
					<form>
						<h1> Sign up </h1>
						<FormControl>
							<label htmlFor="signup-full-name"> Full name </label>
							<TextField 
								placeholder="Full name"
								id="signup-full-name"
								value={fullName}
								onChange={e => setFullName(e.target.value)}
							/>
							{nameErr.length ? <FormHelperText style={{color: "#FF3333"}}> { nameErr } </FormHelperText> : null }
						</FormControl>
						<FormControl>
							<label htmlFor="signup-email-address"> Email Address </label>
							<TextField 
								placeholder="Email Address"
								type="email"
								id="signup-email-address"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							{emailErr.length ? <FormHelperText style={{color: "#FF3333"}}> { emailErr } </FormHelperText> : null }
						</FormControl>
						<FormControl>
							<label htmlFor="signup-password"> Password </label>
							<TextField
								placeholder="Password"
								type="password"
								id="signup-password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{passwordErr.length ? <FormHelperText style={{color: "#FF3333"}}> { passwordErr } </FormHelperText> : null }
						</FormControl>
						<FormControl>
							<label htmlFor="signup-confirm-password"> Confirm Password </label>
							<TextField
								placeholder="Confirm Password"
								type="password"
								id="signup-confirm-password"
								value={confirmedPassword}
								onChange={e => setConfirmedPassword(e.target.value)}
							/>
							{passwordErr === "Passwords doesn't match" ? <FormHelperText style={{color: "#FF3333"}}> Passwords doesn't match </FormHelperText> : null }
						</FormControl>
						<FormControl>
							<label htmlFor="signup-gender"> Gender </label>
							<Select
								id="signup-gender"
								value={gender}
								onChange={e => setGender(e.target.value)}
							>
								<MenuItem value="gender"> Select gender </MenuItem>
								<MenuItem value="male"> Male </MenuItem>
								<MenuItem value="female"> Female </MenuItem>
							</Select>
							{genderErr.length ? <FormHelperText style={{color: "#FF3333"}}> { genderErr } </FormHelperText> : null }
						</FormControl>
						<Button 
							variant="contained"
							type="submit"
							onClick={signupUser}
						> 
							Sign up
						</Button>
						<div> 
							Already have an account? 
							<a 
								onClick={() => {
									setIsSignIn(true)
									setEmail("")
									setPassword("")
								}}
							> 
								Sign in 
							</a> 
						</div>
					</form>
				) : (
					<form>
						<h1> Sign in </h1>
						
						<FormControl>
							<label htmlFor="signup-email-address"> Email Address </label>
							<TextField 
								placeholder="Email Address"
								type="email"
								id="signup-email-address"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							{ signInEmailErr.length ? <FormHelperText style={{color: "#FF3333"}}> { signInEmailErr } </FormHelperText> : null }
						</FormControl>
						<FormControl>
							<label htmlFor="signup-password"> Password </label>
							<TextField
								placeholder="Password"
								type="password"
								id="signup-password"
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							{ signInPasswordErr.length ? <FormHelperText style={{color: "#FF3333"}}> { signInPasswordErr } </FormHelperText> : null }
						</FormControl>
						<Button 
							variant="contained"
							onClick={signInUser}
						> 
							Sign in 
						</Button>
						<div> 
							Don't have an account? 
							<a 
								onClick={() => { 
									setIsSignIn(false)
									setEmail("")
									setPassword("")
								}}
							> 
								Create one 
							</a> 
						</div>
					</form>
				)
			}

			<div className="auth__right">
				<img 
					src={loginSvg}
					alt=""
					className=""
				/>
				<h1> Start Blogging today </h1>
			</div>
			<Snackbar 
				open={open} 
				autoHideDuration={6000} 
				onClose={() => setOpen(false)}
			>
		        <Alert 
		        	onClose={() => setOpen(false)} 
		        	severity="error" 
		        	sx={{ width: '100%' }}
		        >
		          { otherErrors }
		        </Alert>
      		</Snackbar>
		</div>
	)
}

export default Auth;