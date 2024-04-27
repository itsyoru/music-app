import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import StarRatings from 'react-star-ratings';

const SearchBar = ({ onAlbumSelect }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });

    useEffect(() => {
        if (currentAlbum?.tracks?.items?.length > 0) {
            const artistNames = currentAlbum.tracks.items[0].artists.map(artist => artist.name).join(' ');
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(currentAlbum.tracks.items[0].name + ' ' + artistNames)}&type=video&key=AIzaSyCjnRfIVkZkci52e3v4AmyEvHvWebfqd84`)
                .then(response => response.json())
                .then(data => {
                    if (data.items && data.items.length > 0) {
                        setYoutubeVideoId(data.items[0].id.videoId);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }, [currentAlbum]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const openModal = async (album) => {
        try {
            const tokenResponse = await fetch('http://localhost:3001/token');
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.token;

            const response = await fetch(`https://api.spotify.com/v1/albums/${album.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            setCurrentAlbum(data);
            setModalIsOpen(true);
            setResults([]); 

            
            onAlbumSelect(album.id); 
        } catch (error) {
            console.error('Failed to fetch album details:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username');

        const review = {
            rating: Number(reviewForm.rating),
            comment: reviewForm.comment,
            spotifyID: currentAlbum.id,
            user: username,
            albumName: currentAlbum.name, 
            albumCoverArt: currentAlbum.images[0]?.url
        };

        const response = await fetch('http://localhost:5001/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });

        if (response.ok) {
            alert('Review submitted successfully!');
            setModalIsOpen(false);
        } else {
            alert('Failed to submit review');
        }
    };

    const searchSpotify = async () => {
        try {
            const tokenResponse = await fetch('http://localhost:3001/token');
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.token;
    
            const response = await fetch(`https://api.spotify.com/v1/search?q=${debouncedTerm}&type=album,track`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setResults(data.albums.items.sort((a, b) => b.popularity - a.popularity).slice(0, 10));
        } catch (error) {
            console.error('Failed to search Spotify:', error);
        }
    };
    

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedTerm) {
            searchSpotify();
        }
    }, [debouncedTerm]);

    return (
        <div>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={handleSearch} 
                placeholder="Search for an album/artist/track here!"
                style={{ width: '340px', height: '30px', fontSize: '18px' }} 
            />

            {results.map((album, index) => (
    <div key={index} onClick={() => {
        openModal(album);
        props.onAlbumSelect(album.id);
    }}>
        <img src={album.images[2]?.url} alt={album.name} style={{ width: '50px', height: '50px' }} /> {/* Display the smallest image */}
        <p>{album.name}</p>
        <p>{album.artists.map(artist => artist.name).join(', ')}</p>
    </div>
))}

<Modal 
    isOpen={modalIsOpen} 
    onRequestClose={closeModal} 
    style={{
        content: {
            display: 'flex', 
            justifyContent: 'space-between',
            backgroundColor: '#c8b4fd', 
            padding: '20px'
        }
    }}
>
    <div style={{ marginRight: '20px' }}>
        <img 
            src={currentAlbum?.images[0]?.url} 
            alt={currentAlbum?.name} 
            className="album-cover" 
            style={{ width: '500px', height: '500px', marginBottom: '20px' }} 
        />
        <h2>{currentAlbum?.name}</h2>
        <p>{currentAlbum?.artists.map(artist => artist.name).join(', ')}</p>
        {currentAlbum?.album_type === "album" && (
            <ul>
                {currentAlbum.tracks.items.map((track, index) => (
                    <li key={index}>{track.name}</li>
                ))}
            </ul>
        )}
        <button style={{ backgroundColor: 'white', color: 'black', marginRight: '10px', marginTop: '20px' }} onClick={() => {}}>Set as Favorite ❤️</button>
        <button style={{ backgroundColor: 'white', color: 'black', marginTop: '20px' }} onClick={() => {}}>Add to Playlist 🎵</button>
    </div>
    <div>
        <h2>Review {currentAlbum?.name}</h2>
        <form onSubmit={handleReviewSubmit} style={{ marginBottom: '20px' }}>
            <label>
                Rating:
                <StarRatings
                    rating={parseInt(reviewForm.rating) || 0}
                    starRatedColor="blue"
                    changeRating={(newRating) => setReviewForm({ ...reviewForm, rating: newRating })}
                    numberOfStars={5}
                    name='rating'
                    starDimension="20px"
                    starSpacing="5px"
                />
            </label>
            <label style={{ display: 'block', marginTop: '10px' }}>
                Comment:
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required style={{ width: '100%', height: '100px', marginTop: '5px' }} />
            </label>
            <button type="submit" style={{ display: 'block', marginTop: '10px' }}>Submit Review</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {youtubeVideoId && (
        <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube.com/embed/${youtubeVideoId}`} 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style={{ marginBottom: '20px' }}
        ></iframe>
    )}
    <iframe 
        src={`https://open.spotify.com/embed/album/${currentAlbum?.id}`} 
        width="300" 
        height="380" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media"
    ></iframe>
</div>
    </div>
</Modal>
        </div>
    );
};

export default SearchBar;