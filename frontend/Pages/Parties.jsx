import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';

function Parties() {
    const { partyName } = useParams();
    const localStorageKey = `videoQueue-${partyName}`;
    const [player, setPlayer] = useState(null);
    const intervalRef = useRef(null);

    const [videoQueue, setVideoQueue] = useState(() => {
        const savedQueue = localStorage.getItem(localStorageKey);
        return savedQueue ? JSON.parse(savedQueue) : [{id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Video)'}];
    });
    const [currentVideo, setCurrentVideo] = useState(null);
    const [newVideoId, setNewVideoId] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(0);

    
    const handleStateChange = (event) => {
        if (event.data === YouTube.PlayerState.PLAYING) {
            intervalRef.current = setInterval(() => {
                const currentTime = event.target.getCurrentTime();
                setCurrentTime(currentTime);

                axios.post(`http://localhost:5001/party/${partyName}/currentTime`, { currentTime });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
    };

    const handleReady = (event) => {
        const player = event.target;
        setPlayer(player);

        // Seek to the current time when the video is ready
        player.seekTo(currentTime);
    };

    const apiKey = 'AIzaSyCjnRfIVkZkci52e3v4AmyEvHvWebfqd84';

    useEffect(() => {
        // Fetch the current video and its playback time from the server when the component mounts
        axios.get(`http://localhost:5001/party/${partyName}/currentVideo`)
            .then(response => {
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
        axios.get(`http://localhost:5001/party/${partyName}/videos`)
            .then(response => {
                if (response.data.length > 0) {
                    setVideoQueue(response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleVideoEnd = () => {
        // Remove the current video from the queue
        const newQueue = videoQueue.slice(1);
        setVideoQueue(newQueue);

        // Set the next video as the current video
        setCurrentVideo(newQueue[0]);
    };

    const addVideoToQueue = (video) => {
        fetch(`http://localhost:5001/party/${partyName}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(video),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                setVideoQueue(prevQueue => [...prevQueue, video]);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleAddVideo = (event) => {
        event.preventDefault();
    
        // Fetch video details from YouTube API
        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${newVideoId}&key=${apiKey}&part=snippet`)
            .then(response => {
                if (response.data.items.length > 0) {
                    const video = {
                        id: newVideoId,
                        title: response.data.items[0].snippet.title
                    };
                    addVideoToQueue(video);
                    setNewVideoId(''); // Clear the input field
                } else {
                    alert('Video not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleNewMessage = () => {
        const username = localStorage.getItem('username');
        if (username) {
            setMessages([...messages, { username, text: newMessage }]);
            setNewMessage('');
        } else {
            alert('You must be logged in to send a message.');
        }
    };

    return (

        <>
        <Navbar />

        <div className='party-section'>
            <h1>Party Room</h1>
            <h2>Now Playing: {currentVideo?.title}</h2>
            {currentVideo && (
                 <YouTube
                 videoId={currentVideo.id}
                 opts={{ playerVars: { autoplay: 1 } }}
                 onEnd={handleVideoEnd}
                 onStateChange={handleStateChange}
                 onReady={handleReady}
             />
            )}            <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <input
                type="text"
                value={newVideoId}
                onChange={e => setNewVideoId(e.target.value)}
                placeholder="Enter YouTube video ID"
                required
                style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add to Queue</button>
        </form>
        <h2>Up Next:</h2>
        <ul style={{ listStyleType: 'none' }}>
            {videoQueue.slice(1).map((video, index) => (
                <li key={index}>{video.title}</li>
            ))}
        </ul>
        <div className="chatbox" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            {messages.map((message, index) => (
                <p key={index}><strong>{message.username}:</strong> {message.text}</p>
            ))}
            <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message here"
                style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button onClick={handleNewMessage} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
        </div>
    </div>
    </>
);
}

export default Parties;