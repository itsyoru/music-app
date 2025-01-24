import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Parties() {
  const { partyName } = useParams();
  const localStorageKey = `videoQueue-${partyName}`;
  const [player, setPlayer] = useState(null);
  const intervalRef = useRef(null);

  const [videoQueue, setVideoQueue] = useState(() => {
    const savedQueue = localStorage.getItem(localStorageKey);
    return savedQueue
      ? JSON.parse(savedQueue)
      : [
          {
            id: "dQw4w9WgXcQ",
            title: "Rick Astley - Never Gonna Give You Up (Video)",
          },
        ];
  });
  const [currentVideo, setCurrentVideo] = useState(null);
  const [newVideoId, setNewVideoId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  const handleStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      intervalRef.current = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        setCurrentTime(currentTime);

        axios.post(`http://localhost:5001/party/${partyName}/currentTime`, {
          currentTime,
        });
      }, 1000);
    } else if (event.data === YouTube.PlayerState.ENDED) {
      handleVideoEnd();
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const handleReady = (event) => {
    const player = event.target;
    setPlayer(player);

    player.seekTo(currentTime);
  };

  const apiKey = "AIzaSyCjnRfIVkZkci52e3v4AmyEvHvWebfqd84";

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/party/${partyName}/chat`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/party/${partyName}/currentVideo`)
      .then((response) => {
        setCurrentVideo(response.data.video);
        setCurrentTime(response.data.currentTime);
      });
  }, [partyName]);

  useEffect(() => {
    if (!currentVideo) {
      setCurrentVideo(videoQueue[0]);
    }
  }, [currentVideo, videoQueue]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(videoQueue));
  }, [videoQueue]);

  useEffect(() => {
    console.log(`Fetching videos for party: ${partyName}`);
    axios
      .get(`http://localhost:5001/party/${partyName}/videos`)
      .then((response) => {
        if (response.data.length > 0) {
          setVideoQueue(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleVideoEnd = () => {
    const newQueue = videoQueue.slice(1);
    setVideoQueue(newQueue);

    const nextVideo = newQueue[0];
    setCurrentVideo(nextVideo);

    if (player) {
      player.loadVideoById(nextVideo.id);
    }
  };

  const addVideoToQueue = (video) => {
    fetch(`http://localhost:5001/party/${partyName}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(video),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alert("Error: " + data.error);
        } else {
          setVideoQueue((prevQueue) => [...prevQueue, video]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const extractVideoId = (url) => {
    const regex = /(youtu\.be\/|watch\?v=)([^&]+)/;
    const match = url.match(regex);
    return match ? match[2] : url;
  };

  function extractPlaylistId(url) {
    const regex = /(list=)([^&]+)/;
    const match = url.match(regex);
    return match ? match[2] : null;
  }

  const handleAddVideo = (event) => {
    event.preventDefault();

    const videoId = extractVideoId(newVideoId);
    const playlistId = extractPlaylistId(newVideoId);

    if (playlistId) {
      // Fetch playlist details from YouTube API
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${apiKey}&part=snippet`
        )
        .then((response) => {
          if (response.data.items.length > 0) {
            response.data.items.forEach((item) => {
              const video = {
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
              };
              addVideoToQueue(video);
            });
            setNewVideoId(""); // Clear the input field
          } else {
            alert("Playlist not found");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // Fetch video details from YouTube API
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
        )
        .then((response) => {
          if (response.data.items.length > 0) {
            const video = {
              id: videoId,
              title: response.data.items[0].snippet.title,
            };
            addVideoToQueue(video);
            setNewVideoId(""); // Clear the input field
          } else {
            alert("Video not found");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleNewMessage = async () => {
    const username = localStorage.getItem("username");
    if (username) {
      try {
        await axios.post(`http://localhost:5001/party/${partyName}/chat`, {
          user: username,
          message: newMessage,
        });
        fetchMessages();
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      alert("You must be logged in to send a message.");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="party-section"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: "50px",
        }}
      >
        <div>
          <h1>{partyName}</h1>
          <h2>Now Playing: {currentVideo?.title}</h2>
          {currentVideo && (
            <YouTube
              videoId={currentVideo.id}
              opts={{ playerVars: { autoplay: 1 } }}
              onEnd={handleVideoEnd}
              onStateChange={handleStateChange}
              onReady={handleReady}
            />
          )}{" "}
          <form
            onSubmit={handleAddVideo}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              value={newVideoId}
              onChange={(e) => setNewVideoId(e.target.value)}
              placeholder="Enter YouTube link!"
              required
              style={{
                margin: "10px 0",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Queue
            </button>
          </form>
          <h2>Up Next:</h2>
          <ul style={{ listStyleType: "none" }}>
            {videoQueue.map((video, index) => (
              <li key={index}>
                {index + 1}. {video.title}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="chatbox"
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            width: "300px",
            maxHeight: "350px",
            overflowY: "auto",
            marginTop: "175px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <strong>{message.user}: </strong>
                <span>{message.message}</span>
              </div>
            ))}
          </div>
          <div>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message!"
              style={{
                margin: "10px 0",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <button
              onClick={handleNewMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Parties;
