import '../App.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const Browse = () => {
    const [newReleases, setNewReleases] = useState([]);
    const [top10, setTop10] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/new-releases')
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
            albumId: currentAlbum.id,
            username: username
        };

        // Post the review
        const response = await fetch('http://localhost:3001/reviews', {
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
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <p style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '60px' }}>New Releases</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                {newReleases.map((release, index) => (
                    <div key={index} style={{ margin: '10px', width: 'calc(16.66% - 20px)', overflow: 'hidden' }}> 
                        <img src={release.cover_art} alt={release.name} className="album-cover" onClick={() => openModal(release)} />
                        <div>
                            <p>{release.name}</p>
                            <p>{release.artist}</p>
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
                <p>{release.artist}</p>
            </div>
        </div>
    ))}
</div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
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
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Browse;