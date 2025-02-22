import React, { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import StarRatings from "react-star-ratings";
import Footer from "../Components/Footer";

function Review({ review }) {
  return (
    <div className="review">
      <img
        src={review.albumCoverArt}
        alt={review.albumName}
        className="review-cover-art"
      />{" "}
      {/* add class */}
      <h3>{review.albumName}</h3> {/* display the album name */}
      <p>{review.comment}</p>
      <StarRatings
        rating={parseInt(review.rating) || 0}
        starRatedColor="gold"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="5px"
      />
    </div>
  );
}

function Album({ album }) {
  return (
    <div className="album">
      <img
        src={album.cover_art}
        alt={album.name}
        style={{ width: "100px", height: "100px" }}
      />
      <p>{album.name}</p>
    </div>
  );
}

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/albums")
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error("Error:", error));

    fetch("http://localhost:5001/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <Navbar />

      <div
        className="albums-container"
        style={{ position: "absolute", top: "120px", left: "25px" }}
      >
        <div style={{ marginBottom: "20px" }}>Trending on DEN...</div>
        {albums.map((album, index) => (
          <Album key={index} album={album} />
        ))}
      </div>

      <div
        className="search-bar-container"
        style={{ position: "fixed", top: "10px", right: "10px" }}
      >
        <SearchBar />
      </div>

      <div
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://cdn.dribbble.com/userupload/7562954/file/original-4e1255804fbdc6f4d9f8ca91fe6392b5.gif)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          height: "90vh",
          width: "100vw",
        }}
      >
        <h1></h1>
      </div>

      <div
        className="features-container"
        style={{ padding: "40px", marginRight: "-100px" }}
      >
        <h2 style={{ fontFamily: "monospace", marginRight: "-100px" }}>
          DEN ALLOWS YOU TO...
        </h2>
        <ul style={{ listStyleType: "none" }}>
          <li>Discover new music.</li>
          <li>Catalogue what you've been listening to.</li>
          <li>Customize profiles to share with others.</li>
          <li>Listen to music with friends in parties.</li>
        </ul>
      </div>

      <div
        className="feed-container"
        style={{ overflow: "hidden", fontSize: "0.8em", marginTop: "60px" }}
      >
        <h2
          style={{
            marginTop: "14px",
            fontSize: "1.4em",
            fontFamily: "monospace",
          }}
        >
          LATEST REVIEWS
        </h2>
        <div
          className="reviews-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                margin: "10px",
                width: "calc(20% - 20px)",
                overflow: "hidden",
              }}
            >
              <Review review={review} />
              <p
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {review.albumName}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
