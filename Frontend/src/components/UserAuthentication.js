import React, { useState, useEffect } from 'react';

const UserAuthentication = ({ checkAuthentication }) => {
	
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [isAuthorized, setIsAuthorized] = useState(true);
	const [message, setMessage] = useState("");
	
	const handleChange = (event) => {
		if (event.target.name === "username") {
			setUserName(event.target.value.trim());
		}
		if (event.target.name === "useremail") {
			setUserEmail(event.target.value.trim());
		}
		if (event.target.name === "userpassword") {
			setUserPassword(event.target.value.trim());
		}
	}
	
	const logInUser = (event) => {
		if (userEmail !== "" && userName !== "" && userPassword !== "") {
			
			let data = {
				"name": userName,
				"email": userEmail,
				"password": userPassword
			};
			
			fetch(`http://localhost:5000/signin`, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data) 
			})
			.then(response => response.json())
			.then(res => {
				checkAuthentication(event, res.authenticated);
				if (!res.authorized) {
					setIsAuthorized(res.authorized);
					setMessage(res.message);
				}
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	const registerUser = (event) => {
		if (userEmail !== "" && userName !== "" && userPassword !== "") {
			
			let data = {
				"name": userName,
				"email": userEmail,
				"password": userPassword
			};
			
			fetch(`http://localhost:5000/users`, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data) 
			})
			.then(response => response.json())
			.then(res => {
				if (res.authorized) {
					setMessage("");
					setIsAuthorized(res.authorized);
				}
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	return (
		<div className="row">
			<div className="col-4" style={{"margin": "5rem auto"}}>
				<h3>Log in form</h3>
				<div className="form-group">
				 <label className="float-left text-primary">User name: </label>
				 <input 
				 className="form-control" 
				 type="text" 
				 name="username" 
				 pattern="^[A-Za-z ]+$" 
				 onChange={(event) => handleChange(event)}
				 placeholder="Name" 
				 required 
				 />
				</div>
				<div className="form-group">
				 <label className="float-left text-primary">Email: </label>
				 <input 
				 className="form-control" 
				 type="email" 
				 name="useremail" 
				 pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" 
				 onChange={(event) => handleChange(event)} 
				 placeholder="Email" 
				 required 
				 />
				</div>
				<div className="form-group">
				 <label className="float-left text-primary">Password: </label>
				 <input 
				 className="form-control" 
				 type="password" 
				 name="userpassword" 
				 pattern="^[A-Za-z0-9 ]+$"  
				 min="8"
				 onChange={(event) => handleChange(event)}
				 placeholder="Password" 
				 required 
				 />
				</div>
				{isAuthorized ?
					<>
					<button 
					type="submit" 
					className="btn btn-outline-success"
					onClick={(event) => logInUser(event)}
					>
					Log in
					</button>
					</>
					:
					<>
					<button 
					type="submit" 
					className="btn btn-outline-success"
					onClick={(event) => registerUser(event)}
					>
					Register
					</button>
					</>
				}
				{(message !== "") ?
					<>
						<p className="text-secondary mt-2">{message}</p>
					</>
					:
					null
				}
			</div>
		</div>
	);
}

export default UserAuthentication;