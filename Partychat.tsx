import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Partychat() {
    const { partyId, partyName } = useParams();
    const [messages, setMessages] = useState<String[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const decodedPartyName = partyName ? decodeURIComponent(partyName) : '';
    useEffect(() => {
        // Fetch messages for the initial room
        fetchMessages();
    }, [roomId]); // Refetch messages when roomId changes

    const fetchMessages = async () => {
        // Simulating messages fetched from the backend, replace with actual backend
        const fetchedMessages: String[] = [
            "help",
            "why",
            "save me"
        ];
        setMessages(fetchedMessages);
    };

    const sendMessage = () => {
        // Add locally entered message to the messages array
        setMessages(prevMessages => [...prevMessages, "username: " + newMessage]);
        // Clear the input field after sending the message
        setNewMessage('');
    };
    
    return (
        <div>
            <h1>{decodedPartyName}</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="send chat"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Partychat;