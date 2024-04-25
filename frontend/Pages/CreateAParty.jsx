import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateOrJoinAParty() {
    const navigate = useNavigate();

    const [partyNameToCreate, setPartyNameToCreate] = useState('');
    const [partyNameToJoin, setPartyNameToJoin] = useState('');
    const [parties, setParties] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/parties')
            .then(response => response.json())
            .then(data => setParties(data.map(party => party.name)));
    }, []);

    const handleCreateParty = (event) => {
        event.preventDefault();
        if (parties.includes(partyNameToCreate)) {
            alert('A party with this name already exists');
            return;
        }
        fetch('http://localhost:5001/party', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: partyNameToCreate }),
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
                setParties(prevParties => [...prevParties, partyNameToCreate]);
                navigate(`/Parties/${partyNameToCreate}`);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleJoinParty = (event) => {
        event.preventDefault();
        if (!parties.includes(partyNameToJoin)) {
            alert('This party does not exist');
            return;
        }
        navigate(`/Parties/${partyNameToJoin}`);
    };

    return (
        <div>
            <form onSubmit={handleCreateParty}>
                <input type="text" value={partyNameToCreate} onChange={e => setPartyNameToCreate(e.target.value)} placeholder="Enter party name" required />
                <button type="submit">Create Party</button>
            </form>
            <form onSubmit={handleJoinParty}>
                <input type="text" value={partyNameToJoin} onChange={e => setPartyNameToJoin(e.target.value)} placeholder="Enter party name" required />
                <button type="submit">Join Party</button>
            </form>
            <div>
                <h2>Created Parties</h2>
                <ul>
                    {parties.map(party => (
                        <li key={party}>{party}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CreateOrJoinAParty;