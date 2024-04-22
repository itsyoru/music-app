import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const SearchBar = ({ onAlbumSelect }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });

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
            user: username
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
            backgroundColor: '#D3D3D3' 
        }
    }}
>
    {currentAlbum && (
        <div>
            <img 
                src={currentAlbum.images[0]?.url} 
                alt={currentAlbum.name} 
                className="album-cover" 
                style={{ width: '500px', height: '500px' }} 
            />
            <h2>{currentAlbum.name}</h2>
            <p>{currentAlbum.artists.map(artist => artist.name).join(', ')}</p>
            {currentAlbum.album_type === "album" && (
                <ul>
                   {currentAlbum.tracks.items.map((track, index) => (
    <li key={index}>{track.name}</li>
))}
                </ul>
            )}
        </div>
    )}
     <div>
        <h2>Review {currentAlbum?.name}</h2>
        <form onSubmit={handleReviewSubmit}>
            <label>
                Rating:
                <input type="number" min="1" max="5" value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })} required />
            </label>
            <label>
                Comment:
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
            </label>
            <button type="submit">Submit Review</button>
        </form>
    </div>
</Modal>
        </div>
    );
};

export default SearchBar;