import React, { useState, useEffect } from 'react';
import '../App.css';
import Navbar from '../Components/Navbar';
import SearchBar from '../Components/SearchBar';
import records from '../assets/records.jpg';

function Review({ review }) {
  return (
    <div>
      <p>{review.comment}</p>
      <p>{new Date(review.reviewedDate).toLocaleString()}</p>
    </div>
  );
}

function Album({ album }) {
  return (
    <div> 
      <img src={album.cover_art} alt={album.name} className="album-cover" />
      <p className="album-details">{album.name}</p>
      <p className="album-details" style={{ marginTop: '5px' }}>{album.artists.join(', ')}</p>
    </div>
  );
}

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/albums')
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.error('Error:', error));

    fetch('http://localhost:5001/reviews')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="feed-container">
        <h2 style={{ marginTop: '20px' }}>Latest Reviews</h2>
        {reviews.map((review, index) => (
          <Review key={index} review={review} />
        ))}
      </div>
  
      <div style={{ flex: 1 }}>
        <h1>DEN</h1>
        <p style={{ fontSize: '1.4em' }}>A social networking website for music lovers. </p>  
        <div className="search-bar-container" style={{ zIndex: 1 }}>
          <SearchBar />
        </div>
    
        <div style={{
          backgroundImage: `url(${records})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '60% auto',
          backgroundPosition: 'center',
          width: '200%',
          height: '50vh', 
          position: 'relative',
          left: '-50%'
        }}>
          <Navbar />
        </div>
    
        <h2 style={{ marginTop: '20px' }}>What we're listening to...</h2>
    
        <div className="albums-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', margin: '80px 80px 80px 20px' }}>
          {albums.map(album => <Album key={album.name} album={album} />)}
        </div>
      </div>
    </div>
  );
}

export default Homepage;