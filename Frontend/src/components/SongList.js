import React, { useState, useEffect } from 'react';
import SongForm from './SongForm';

const SongList = ({ checkAuthentication }) => {
	
	const [showForm, setShowForm] = useState(false);
	const [songList, setSongList] = useState(undefined);
	const [selectedSong, setSelectedSong] = useState(undefined);
	const [keyword, setKeyword] = useState("");
	const [modifiedSongList, setModifiedSongList] = useState(undefined);
	const [songNumberPerPage, setSongNumberPerPage] = useState(null);
	
	const showSongForm = (event) => {
		setShowForm(!showForm);
	}
	
	const handleChange = (event) => {
		if (event.target.name === "search") {
			setKeyword(event.target.value.trim());
		}
		if (event.target.name === "listsize") {
			setSongNumberPerPage(event.target.value.trim());
		}
	}
	
	useEffect(() => {
		if (showForm) {
			setKeyword("");
			setSongNumberPerPage(null);
		}
	}, [showForm]);
	
	useEffect(() => {
		if (keyword !== "" && songList !== undefined) {
			let result = [];
			result = songList.filter((element, index) => {
				if (keyword.toLowerCase() === element.title.toLowerCase() ||
					keyword.toLowerCase() === element.artists.toLowerCase() ||
					keyword.toLowerCase() === element.img.toLowerCase()
				) {
					return element;
				}
			});
			setModifiedSongList(result);
		}
	}, [keyword]);
	
	useEffect(() => {
		if (songNumberPerPage !== null && songNumberPerPage < songList.length) {
			let songPerPage = [];
			if (modifiedSongList !== undefined && modifiedSongList.length !== 0 && songNumberPerPage < modifiedSongList.length) {
				songPerPage = modifiedSongList.filter((element, index) => {
					if (index < songNumberPerPage) {
						return element;
					}
				});
			} else {
				songPerPage = songList.filter((element, index) => {
					if (index < songNumberPerPage) {
						return element;
					}
				});
			}
			setModifiedSongList(songPerPage);
		}
	}, [songNumberPerPage]);
	
	const editSong = (event, songId) => {
		fetch(`http://localhost:5000/song/${songId}`, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				}
			})
			.then(response => response.json())
			.then(res => {
				if (res.song) {
					setShowForm(true);
					setSelectedSong(res.song);
					setSongList(undefined);
				}
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}
	
	const deleteSong = (event, songId) => {
		fetch(`http://localhost:5000/song/${songId}`, {
				method: 'DELETE',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				}
			})
			.then(response => response.json())
			.then(res => {
				getSongList();
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}
	
	const logOut = (event) => {
		fetch(`http://localhost:5000/signout`, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				}
			})
			.then(response => response.json())
			.then(res => {
				checkAuthentication(event, res.authenticated);
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}
	
	useEffect(() => {
		if (!showForm) {
			getSongList();
			setSelectedSong(undefined);
		} else {
			setSongList(undefined);
		}
	}, [showForm]);
	
	const getSongList = () => {
		fetch(`http://localhost:5000/songs`, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
				  'Access-Control-Allow-Origin': 'http://localhost:3000/',
				  'Access-Control-Allow-Credentials': 'true',
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				}
			})
			.then(response => response.json())
			.then(res => {
				if (res.songs) {
					setSongList(res.songs);
				}
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}
	
	const imgUrl = "http://localhost:5000/uploads/";
	
	return (
		<>
			<div className="row">
				<div className="col-12 mt-5 mb-3">
					<h3>Song list</h3>
					<div className="row">
						<div className="col-12 mt-5">
						{!showForm ?
							<div className="form-group float-right">
								 <input 
								 className="form-control" 
								 type="number" 
								 name="listsize" 
								 pattern="^[0-9]+$" 
								 min="1"
								 onChange={(event) => handleChange(event)}
								 placeholder="No. of songs per page" 
								 required 
								 />
							</div>
							:
							null
						}
						</div>
					</div>
					<div className="row">
						<div className="col-6">
						{!showForm ?
							<div className="form-group">
								 <input 
								 className="form-control float-left" 
								 type="text" 
								 name="search" 
								 pattern="^[A-Za-z0-9 ]+$" 
								 onChange={(event) => handleChange(event)}
								 placeholder="Search" 
								 required 
								 />
							</div>
							:
							null
						}
						</div>
						<div className="col-6">
							<button 
							className="btn btn-outline-danger float-right ml-2" 
							onClick={(event) => logOut(event)}
							>
							Sign out
							</button>
							<button 
							className="btn btn-outline-primary float-right" 
							onClick={(event) => showSongForm(event)}
							>
							{showForm ? "Show song list" : "Add song"}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				{showForm ?
					<SongForm 
					selectedSong={selectedSong} 
					/>
					:
					<div className="col-12">
						{(modifiedSongList !== undefined && modifiedSongList.length !== 0) ?
								modifiedSongList.map((element, index) => {
									return <div className="card mb-3" key={index} style={{"maxWidth": "100%"}}>
												<div className="row no-gutters">
													<div className="col-md-4">
														<img src={imgUrl.concat(element.img)} className="card-img" alt={element.img} height={"200"} />
													</div>
													<div className="col-md-8">
													  <div className="card-body">
														<h5 className="card-title">Title: {element.title}</h5>
														<p className="card-text">Artists: {element.artists}</p>
													  </div>
													  <div className="mt-4">
														<button className="btn btn-outline-warning mr-2" onClick={(event) => editSong(event, element._id)}>Edit</button>
														<button className="btn btn-outline-danger" onClick={(event) => deleteSong(event, element._id)}>Delete</button>
													  </div>
													</div>
												</div>
											</div>;
								})
								:
								(songList !== undefined) ?
								songList.map((element, index) => {
									return <div className="card mb-3" key={index} style={{"maxWidth": "100%"}}>
												<div className="row no-gutters">
													<div className="col-md-4">
														<img src={imgUrl.concat(element.img)} className="card-img" alt={element.img} height={"200"} />
													</div>
													<div className="col-md-8">
													  <div className="card-body">
														<h5 className="card-title">Title: {element.title}</h5>
														<p className="card-text">Artists: {element.artists}</p>
													  </div>
													  <div className="mt-4">
														<button className="btn btn-outline-warning mr-2" onClick={(event) => editSong(event, element._id)}>Edit</button>
														<button className="btn btn-outline-danger" onClick={(event) => deleteSong(event, element._id)}>Delete</button>
													  </div>
													</div>
												</div>
											</div>;
								})
								:
								null
							}
					</div>
				}
		  </div>
		</>
	);
}

export default SongList;