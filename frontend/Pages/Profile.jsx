import React, { useState, useEffect } from 'react';
import '../App.css';
import StarRatings from 'react-star-ratings';

function Profile() {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviews, setReviews] = useState([]);

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

    return (
        <div>
            {isEditing ? (
                <>
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ display: 'block', margin: '5px 0' }}
                        />
                    </label>
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Bio:
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            style={{ display: 'block', margin: '5px 0' }}
                        />
                    </label>
                    <label style={{ display: 'block', margin: '10px 0' }}>
                        Avatar URL:
                        <input
                            type="text"
                            value={avatar}
                            placeholder="Avatar URL"
                            onChange={(e) => setAvatar(e.target.value)}
                            style={{ display: 'block', margin: '5px 0' }}
                        />
                    </label>
                    <button onClick={Save}>Save</button>
                </>
            ) : (
                <>
                    <h4>{username}</h4>
                    <img src={avatar} alt="User Avatar" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <p>Bio: {bio}</p>
                    <button onClick={Edit}>Edit</button>
                    <button onClick={connectSpotify}>Connect your account with Spotify</button>
                    <h2>Recent Activity...</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
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
                    starRatedColor="purple"
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
                </>
            )}
        </div>
    );
}

export default Profile;