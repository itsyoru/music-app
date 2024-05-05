import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';


function CreateOrJoinAParty() {
    const navigate = useNavigate();

    const [partyNameToCreate, setPartyNameToCreate] = useState('');
    const [partyNameToJoin, setPartyNameToJoin] = useState('');
    const [parties, setParties] = useState([]);
    const [partyVideos, setPartyVideos] = useState({}); // Add this line


    useEffect(() => {
        fetch('http://localhost:5001/parties')
            .then(response => response.json())
            .then(data => {
                const partyNames = data.map(party => party.name);
                setParties(partyNames);
    
                const promises = partyNames.map(partyName => 
                    fetch(`http://localhost:5001/party/${partyName}/videos`)
                        .then(response => response.json())
                        .then(videos => ({ partyName, currentVideo: videos[0] }))
                );
                Promise.all(promises).then(videosData => {
                    const videosMap = {};
                    videosData.forEach(({ partyName, currentVideo }) => {
                        videosMap[partyName] = currentVideo;
                    });
                    setPartyVideos(videosMap);
                });
            });
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

        <>
        <Navbar />

        <div style={{ padding: '20px', marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <form onSubmit={handleCreateParty}>
            <input type="text" value={partyNameToCreate} onChange={e => setPartyNameToCreate(e.target.value)} placeholder="Enter party name" required style={{ marginRight: '10px', padding: '10px', backgroundColor: 'white', color: 'black' }} />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Create Party</button>
        </form>
        <span>Create a party to start listening, or join a preexisting one.</span>
        <form onSubmit={handleJoinParty}>
            <input type="text" value={partyNameToJoin} onChange={e => setPartyNameToJoin(e.target.value)} placeholder="Enter party name" required style={{ marginRight: '10px', padding: '10px', backgroundColor: 'white', color: 'black' }} />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>Join Party</button>
        </form>
    </div>
            <div style={{ border: '1px solid #ccc', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
    <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Created Parties</h2>
    <ul style={{ listStyleType: 'none', padding: '0' }}>
    {parties.map((partyName, index) => (
        <li key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
            <strong>{partyName}</strong>
            {partyVideos[partyName] && <><br />Listening now... <strong>{partyVideos[partyName].title}</strong></>}
        </li>
    ))}
</ul>
</div>
        </div>
        </>
    );
}

export default CreateOrJoinAParty;