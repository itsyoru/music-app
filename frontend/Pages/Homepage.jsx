import React, { useState, useEffect } from 'react';
import '../App.css';
import Navbar from '../Components/Navbar';
import SearchBar from '../Components/SearchBar';
import testlogo from '../assets/testlogo.png';

function Review({ review }) {
  return (
    <div className="review">
      <img src={review.albumCoverArt} alt={review.albumName} className="review-cover-art" /> {/* add class */}
      <h3>{review.albumName}</h3> {/* display the album name */}
      <p>{review.comment}</p>
    </div>
  );
}

function Album({ album }) {
  return (
    <div className="album">
      <img src={album.cover_art} alt={album.name} style={{ width: '100px', height: '100px' }} />
      <p>{album.name}</p>
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
    <div>
      <Navbar />

      <div className="albums-container" style={{ position: 'absolute', top: '70px', left: '25px' }}>
        {albums.map((album, index) => (
          <Album key={index} album={album} />
        ))}
      </div>
  
      <div className="search-bar-container" style={{ position: 'fixed', top: '10px', right: '10px' }}>
        <SearchBar />
      </div>
  
      <div style={{ backgroundImage: `url(https://cdn.dribbble.com/userupload/7562954/file/original-4e1255804fbdc6f4d9f8ca91fe6392b5.gif)`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center', height: '90vh', width: '100vw' }}>
        <h1></h1>
      </div>
  
      <div className="features-container" style={{ padding: '20px' }}>
  <h2>DEN ALLOWS YOU TO...</h2>
  <ul style={{ listStyleType: 'none' }}>
    <li>Discover new music.</li>
    <li>Catalogue what you've been listening to.</li>
    <li>Customize profiles to share with others.</li>
    <li>Listen to music with friends in parties.</li>
  </ul>
</div>
  
      <div className="feed-container" style={{ overflow: 'hidden', fontSize: '0.8em', marginTop: '60px' }}>
        <h2 style={{ marginTop: '14px', fontSize: '1.4em' }}>Latest Reviews</h2>
        <div className='reviews-wrapper'>
          {reviews.map((review, index) => (
            <Review key={index} review={review} style={{ width: '60%', padding: '10px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;