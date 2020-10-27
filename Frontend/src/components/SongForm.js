import React, { useState, useEffect, useRef } from 'react';

const SongForm = ({ selectedSong }) => {
	
	const [songId, setSongId] = useState("");
	const [songTitle, setSongTitle] = useState("");
	const [songArtists, setSongArtists] = useState("");
	const songImg = useRef(null);
	const [message, setMessage] = useState("");
	
	useEffect(() => {
		if (selectedSong !== undefined && selectedSong !== null) {
			setSongTitle(selectedSong.title);
			setSongArtists(selectedSong.artists);
			setSongId(selectedSong._id);
		}
	}, [selectedSong]);
	
	const handleChange = (event) => {
		if (event.target.name === "songtitle") {
			setSongTitle(event.target.value.trim());
		}
		if (event.target.name === "songartists") {
			setSongArtists(event.target.value.trim());
		}
	}
	
	const uploadSongImage = (event) => {
		
		const formData = new FormData();
		
		formData.append('songimage', songImg.current.files[0]);
		
		fetch(`http://localhost:5000/upload`, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				body: formData 
			})
			.then(response => response.json())
			.then(res => {
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}
	
	const addSong = (event) => {
		if (songTitle !== "" && songArtists !== "" && songImg !== null) {
			
			let data = {
				"title": songTitle,
				"artists": songArtists,
				"img": songImg.current.files[0].name
			};
			
			uploadSongImage(event);
			
			fetch(`http://localhost:5000/song`, {
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
				setSongTitle("");
				setSongArtists("");
				setMessage(res.message);
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	const updateSong = (event) => {
		if (songTitle !== "" && 
			songArtists !== "" && 
			songImg !== null && 
			songImg.current.files[0] !== undefined &&
			songId !== "" ||
			songTitle !== selectedSong.title ||
			songArtists !== selectedSong.artists ||
			songId !== selectedSong._id
			) {
			
			let data = {
				"title": songTitle,
				"artists": songArtists,
				"img": (songImg.current.files[0] !== undefined) ? songImg.current.files[0].name : selectedSong.img
			};
			
			uploadSongImage(event);
			
			fetch(`http://localhost:5000/song/${songId}`, {
				method: 'PATCH',
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
				setSongTitle("");
				setSongArtists("");
				setMessage(res.message);
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	return (
		<>
			<div className="col-6" style={{"margin": "2rem auto"}}>
				<div className="form-group">
				 <label className="float-left text-primary">Title: </label>
				 <input 
				 className="form-control" 
				 type="text" 
				 name="songtitle" 
				 pattern="^[A-Za-z0-9 ]+$" 
				 value={songTitle}
				 onChange={(event) => handleChange(event)}
				 placeholder="Title" 
				 required 
				 />
				</div>
				<div className="form-group">
				 <label className="float-left text-primary">Artists: </label>
				 <input 
				 className="form-control" 
				 type="text" 
				 name="songartists" 
				 pattern="^[A-Za-z0-9 ]+$" 
				 value={songArtists}
				 onChange={(event) => handleChange(event)} 
				 placeholder="Artists" 
				 required 
				 />
				</div>
				<div className="input-group">
				<input 
				 className="custom-file-input" 
				 type="file"
				 name="songimage"
				 ref={songImg}
				 required 
				 />
				 <label className="custom-file-label float-left text-primary">Choose image </label>
				</div>
				{(message !== "") ?
					<>
						<p className="text-secondary mt-2">{message}</p>
					</>
					:
					null
				}
				{(selectedSong !== undefined) ?
					<button className="btn btn-outline-success mt-3" onClick={(event) => updateSong(event)}>Update</button>
					:
					<button className="btn btn-outline-success mt-3" onClick={(event) => addSong(event)}>Save</button>
				}
			</div>
		</>
	);
}

export default SongForm;