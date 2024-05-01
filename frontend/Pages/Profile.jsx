import React, { useState, useEffect } from 'react';
import '../App.css';
import StarRatings from 'react-star-ratings';
import Navbar from '../Components/Navbar';

function Profile() {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);


    useEffect(() => {
        if (!localStorage.getItem('username')) {
            window.alert('Please log in first!');
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(`http://localhost:5001/users/${localStorage.getItem('username')}`);
            const data = await response.json();

            setUsername(data.username);
            setBio(data.bio);
            setAvatar(data.avatar);
            setEmail(data.email);
        };

        const fetchUserReviews = async () => {
            const response = await fetch(`http://localhost:5001/reviews/${localStorage.getItem('username')}`);
            const data = await response.json();

            setReviews(data);
        };

        fetchUserData();
        fetchUserReviews();
    }, []);

    useEffect(() => {
        const fetchFavoriteAlbums = async () => {
            const response = await fetch(`http://localhost:5001/users/${localStorage.getItem('username')}/favoriteAlbums`);
            const data = await response.json();

            setFavoriteAlbums(data);
        };

        fetchFavoriteAlbums();
    }, []);

    const connectSpotify = async () => {
        try {
            const clientId = '67c2fdb01aa44023ac131087069162f0'; // replace with your client ID
            const redirectUri = encodeURIComponent('http://localhost:5173/profile');
            const scopes = encodeURIComponent('streaming user-read-email user-read-private');
            const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

            window.location.href = url;
        } catch (error) {
            console.error(error);
        }
    };

    const Edit = () => {
        setIsEditing(true);
    };

    const Save = async () => {
        const response = await fetch(`http://localhost:5001/users/${localStorage.getItem('username')}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bio, avatar, email })
        });

        const data = await response.json();

        if (response.ok) {
            setUsername(data.username);
            setBio(data.bio);
            setAvatar(data.avatar);
            setIsEditing(false);
        } else {
            window.alert('An error occurred while updating your profile.');
        }
    };

    const randomIndex = Math.floor(Math.random() * favoriteAlbums.length);

    return (

        <>
        <Navbar />
        <div className='profile-details'>
            <div>
                <div>
                    {isEditing ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <label>
                                    Username
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ display: 'block', margin: '5px 0' }}
                                    />
                                </label>
                                <label>
                                    Bio
                                    <input
                                        type="text"
                                        placeholder="Bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        style={{ display: 'block', margin: '5px 0' }}
                                    />
                                </label>
                                <label>
                                    Avatar URL
                                    <input
                                        type="text"
                                        placeholder="Avatar URL"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        style={{ display: 'block', margin: '5px 0' }}
                                    />
                                </label>
                                <button onClick={Save}>Save</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4>{username}</h4>
                            <img src={avatar} alt="User Avatar" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            <p> {bio}</p>
                            <div style={{ marginBottom: '10px' }}>
                            <button style={{ backgroundColor: '#1DB954', color: '#fff', borderRadius: '25px', padding: '10px 20px', cursor: 'pointer' }} onClick={Edit}>Edit</button>
                        </div>
                        <div>
                            <button style={{ backgroundColor: '#1DB954', color: '#fff', borderRadius: '25px', padding: '10px 20px', cursor: 'pointer' }} onClick={connectSpotify}>Connect your account with Spotify</button>
                        </div>
                        </>
                    )}
                </div>
                <div style={{ marginTop: '20px', marginLeft: '10px' }}>
                    <h2>Now Playing...</h2>
                    <iframe
                        src={`https://open.spotify.com/embed/album/${favoriteAlbums[randomIndex]?.albumId}`} width="300"
                        height="380"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                    ></iframe>
                </div>
            </div>
            <div>
                <h2>Recent Activity...</h2>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    {reviews.slice(-5).map((review, index) => (
                        <div key={index} style={{ margin: '10px', width: 'calc(20% - 20px)', overflow: 'hidden' }}>
                            <img src={review.albumCoverArt} alt={review.albumName} className="album-cover" />
                            <div>
                                <p style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%'
                                }}>
                                    {review.albumName}
                                </p>
                                <div>
                                    <StarRatings
                                        rating={parseInt(review.rating) || 0}
                                        starRatedColor="gold"
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="5px"
                                    />
                                    <p>{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Favorite Albums...</h2>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    {favoriteAlbums.slice(-5).map((album, index) => (
                        <div key={index} style={{ margin: '10px', width: 'calc(20% - 20px)', overflow: 'hidden' }}>
                            <img src={album.albumCoverArt} alt={album.albumName} className="album-cover" />
                            <div>
                                <p style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%'
                                }}>
                                    {album.albumName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );

}

export default Profile;