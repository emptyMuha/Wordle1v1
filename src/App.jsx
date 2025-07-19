import React, { useState, useEffect } from 'react';
import Game from './Game';
import './App.css';

function getRandomRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [inGame, setInGame] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        const storedName = localStorage.getItem('wordle1v1_username');
        if (storedName) setUsername(storedName);
    }, []);

    const handleStart = (e) => {
        e.preventDefault();
        if (!username) return;
        localStorage.setItem('wordle1v1_username', username);
        if (room) {
            setShowModal(false);
            setInGame(true);
        }
    };

    const handleCreateRoom = () => {
        const code = getRandomRoomCode();
        setRoom(code);
        setJoinCode(code);
    };

    const handleJoinRoom = () => {
        if (joinCode.length === 4 && /^[0-9]{4}$/.test(joinCode)) {
            setRoom(joinCode);
        }
    };

    return (
        <main className="container">
            {showModal ? (
                <form className="modal" onSubmit={handleStart}>
                    <h2>Enter your name</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        maxLength={16}
                        placeholder="Your name"
                        required
                    />
                    <div className="room-section">
                        <button type="button" onClick={handleCreateRoom}>Create Room</button>
                        <span>or</span>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={e => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                            placeholder="Room code"
                        />
                        <button type="button" onClick={handleJoinRoom}>Join Room</button>
                    </div>
                    {room && <div className="room-info">Room: <b>{room}</b></div>}
                    <button type="submit" disabled={!username || !room}>Start Game</button>
                </form>
            ) : inGame ? (
                <>
                    <div className="user-bar">Player: <b>{username}</b> | Room: <b>{room}</b></div>
                    <Game username={username} room={room} />
                </>
            ) : null}
        </main>
    );
} 