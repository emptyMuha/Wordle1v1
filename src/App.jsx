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
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('wordle1v1_username');
        if (storedName) setUsername(storedName);
    }, []);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!username) return;
        localStorage.setItem('wordle1v1_username', username);
    };

    const handleCreateGame = () => {
        const code = getRandomRoomCode();
        setRoom(code);
        setInGame(true);
    };

    const handleJoinRoom = () => {
        setShowJoinInput(true);
    };

    const handleJoinSubmit = (e) => {
        e.preventDefault();
        if (joinCode.length === 4 && /^[0-9]{4}$/.test(joinCode)) {
            setRoom(joinCode);
            setInGame(true);
        }
    };

    return (
        <main className="container">
            {!username ? (
                <form className="modal" onSubmit={handleUsernameSubmit}>
                    <h2>Enter your name</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        maxLength={16}
                        placeholder="Your name"
                        required
                        autoFocus
                    />
                    <button type="submit" disabled={!username}>Continue</button>
                </form>
            ) : !inGame ? (
                <div className="vertical-options">
                    <div className="option-square" onClick={handleCreateGame} tabIndex={0} role="button">
                        <h2>Create Game</h2>
                        <p>Start a new game and get a room code to share</p>
                    </div>
                    <div className="option-square" onClick={handleJoinRoom} tabIndex={0} role="button">
                        <h2>Join Room</h2>
                        <p>Enter a 4-digit code to join a friend's game</p>
                        {showJoinInput && (
                            <form className="join-form" onSubmit={handleJoinSubmit}>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength={4}
                                    placeholder="Room code"
                                    required
                                    inputMode="numeric"
                                    pattern="[0-9]{4}"
                                    autoFocus
                                />
                                <button type="submit" disabled={joinCode.length !== 4}>Join</button>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="user-bar">Player: <b>{username}</b> | Room: <b>{room}</b></div>
                    <Game username={username} room={room} />
                </>
            )}
        </main>
    );
} 