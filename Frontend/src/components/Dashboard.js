import React, { useState, useEffect } from 'react';
import UserAuthentication from './UserAuthentication';
import SongList from './SongList';

const Dashboard = ({}) => {
	
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	
	const checkAuthentication = (event, authenticationStatus) => {
		setIsAuthenticated(authenticationStatus);
	}
	
	return (
      <div className="container">
		{isAuthenticated ?
			<SongList
			checkAuthentication={(event, authenticationStatus) => checkAuthentication(event, authenticationStatus)}
			/>
			:
			<UserAuthentication
			checkAuthentication={(event, authenticationStatus) => checkAuthentication(event, authenticationStatus)}
			/>
		}
	  </div>
	);
}

export default Dashboard;