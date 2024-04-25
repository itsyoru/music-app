import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Partychat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        // Fetch messages for the initial room
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/chatroom/${roomId}/messages`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            await axios.post(`http://localhost:3001/chatroom/${roomId}/messages`, { message: newMessage });
            // Clear the input field after sending the message
            setNewMessage('');
            // Refetch messages to update the UI
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>//Partyname</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Partychat;