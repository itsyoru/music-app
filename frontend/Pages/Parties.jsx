import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Parties() {
    const { partyName } = useParams();
    const localStorageKey = `videoQueue-${partyName}`;

    const [videoQueue, setVideoQueue] = useState(() => {
        const savedQueue = localStorage.getItem(localStorageKey);
        return savedQueue ? JSON.parse(savedQueue) : [{id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Video)'}];
    });
    const [currentVideo, setCurrentVideo] = useState(null);
    const [newVideoId, setNewVideoId] = useState('');

    const apiKey = 'AIzaSyCjnRfIVkZkci52e3v4AmyEvHvWebfqd84';

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
                } else {
                    alert('No videos in queue');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleVideoEnd = () => {
        setVideoQueue(oldQueue => {
            const newQueue = oldQueue.slice(1);
            localStorage.setItem(localStorageKey, JSON.stringify(newQueue));
            return newQueue;
        });
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

    return (
        <div>
            <h1>Party Room</h1>
            <h2>Now Playing: {currentVideo?.title}</h2>
            <YouTube videoId={currentVideo?.id} onEnd={handleVideoEnd} key={currentVideo?.id} />
            <form onSubmit={handleAddVideo}>
                <input
                    type="text"
                    value={newVideoId}
                    onChange={e => setNewVideoId(e.target.value)}
                    placeholder="Enter YouTube video ID"
                    required
                />
                <button type="submit">Add to Queue</button>
            </form>
            <h2>Up Next:</h2>
            <ul>
                {videoQueue.slice(1).map((video, index) => (
                    <li key={index}>{video.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Parties;