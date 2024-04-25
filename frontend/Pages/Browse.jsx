import '../App.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import SearchBar from '../Components/SearchBar';
import StarRatings from 'react-star-ratings';

const Browse = () => {
    const [newReleases, setNewReleases] = useState([]);
    const [top10, setTop10] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [tracklist, setTracklist] = useState([]);
    const [kanyeAlbums, setKanyeAlbums] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/artist-albums')
            .then(response => response.json())
            .then(data => setKanyeAlbums(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/new-releases')
            .then(response => response.json())
            .then(data => setNewReleases(data))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/top-ten')
            .then(response => response.json())
            .then(data => setTop10(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username');

        const review = {
            rating: Number(reviewForm.rating),
            comment: reviewForm.comment,
            spotifyID: currentAlbum.id,
            user: username,
            albumName: currentAlbum.name, // add this line
            albumCoverArt: currentAlbum.cover_art // add this line
        };

        console.log(review);
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

    const openModal = (album) => {
        setCurrentAlbum(album);
        setModalIsOpen(true);
    
        if (album.album_type === "album") {
            fetch(`http://localhost:3000/albums/${album.id}/tracks`)
                .then(response => response.json())
                .then(data => setTracklist(data))
                .catch(error => console.error('Error:', error));
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentAlbum(null);
        setTracklist([]);
    };

    return (
        <div>

<SearchBar />
            <p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '60px' }}>New Releases</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            {newReleases.map((release, index) => (
    <div key={index} style={{ margin: '10px', width: 'calc(16.66% - 20px)', overflow: 'hidden' }}> 
        <img src={release.cover_art} alt={release.name} className="album-cover" onClick={() => openModal(release)} />
        <div>
            <p>{release.name}</p>
            <p>{release.artists.join(', ')}</p>
        </div>
    </div>
))}
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '60px' }}>Top 10</p>
<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
{top10.slice(0, 10).map((release, index) => (
    <div key={index} style={{ margin: '10px', width: 'calc(20% - 20px)', overflow: 'hidden' }}> 
        <img src={release.cover_art} alt={release.name} className="album-cover" onClick={() => openModal(release)} />
        <div>
            <p>{release.name}</p>
            <p>{release.artists.join(', ')}</p>
        </div>
    </div>
))}
</div>

<p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '60px' }}>Kanye West's Albums</p>
<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    {kanyeAlbums.map((album, index) => (
        <div key={index} style={{ margin: '10px', width: 'calc(20% - 20px)', overflow: 'hidden' }}>
            <img src={album.cover_art} alt={album.name} className="album-cover" onClick={() => openModal(album)} />
            <div>
                <p>{album.name}</p>
                <p>{album.artists.join(', ')}</p>
            </div>
        </div>
    ))}
</div>

<Modal 
    isOpen={modalIsOpen} 
    onRequestClose={closeModal} 
    style={{
        content: {
            display: 'flex', 
            justifyContent: 'space-between',
            backgroundColor: '#c8b4fd' 
        }
    }}
>
<div>
    <img 
        src={currentAlbum?.cover_art} 
        alt={currentAlbum?.name} 
        className="album-cover" 
        style={{ width: '500px', height: '500px' }} // Adjust the size as needed
    />
    <h2>{currentAlbum?.name}</h2>
    <p>{currentAlbum?.artists.join(', ')}</p>
    {currentAlbum?.album_type === "album" && (
        <ul>
            {tracklist.map((track, index) => (
                <li key={index}>{track.name}</li>
            ))}
        </ul>
    )}
            
            <button style={{ backgroundColor: 'white', color: 'black', marginRight: '10px' }} onClick={() => {}}>Set as Favorite ❤️</button>
            <button style={{ backgroundColor: 'white', color: 'black' }} onClick={() => {}}>Add to Playlist 🎵</button>

</div>
    <div>
        <h2>Review {currentAlbum?.name}</h2>
        <form onSubmit={handleReviewSubmit}>
        <label>
            Rating:
            <StarRatings
                rating={parseInt(reviewForm.rating) || 0}
                starRatedColor="blue"
                changeRating={(newRating) => setReviewForm({ ...reviewForm, rating: newRating })}
                numberOfStars={5}
                name='rating'
            />
        </label>
            <label>
                Comment:
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
            </label>
            <button type="submit">Submit Review</button>
        </form>
        <iframe src={`https://open.spotify.com/embed/album/${currentAlbum?.id}`} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </div>
</Modal>
        </div>
    );
};

export default Browse;