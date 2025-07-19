import React, { useState, useEffect } from 'react';
import Game from './Game';
import './App.css';

function getRandomRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function App() {
    const [username, setUsername] = useState('');
    const [inputName, setInputName] = useState('');
    const [room, setRoom] = useState('');
    const [inGame, setInGame] = useState(false);
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [showNameModal, setShowNameModal] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('wordle1v1_username');
        if (storedName) {
            setUsername(storedName);
            setInputName(storedName);
        }
    }, []);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!inputName) return;
        setUsername(inputName);
        localStorage.setItem('wordle1v1_username', inputName);
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

    // Handle username change from top right button
    const openNameModal = () => {
        setEditName(username);
        setShowNameModal(true);
    };
    const closeNameModal = () => setShowNameModal(false);
    const handleEditNameSubmit = (e) => {
        e.preventDefault();
        if (!editName) return;
        setUsername(editName);
        localStorage.setItem('wordle1v1_username', editName);
        setShowNameModal(false);
    };

    return (
        <main className="container">
            {username && (
                <button
                    className="username-btn"
                    onClick={openNameModal}
                    aria-label="Change username"
                >
                    {username}
                </button>
            )}
            {showNameModal && (
                <div className="modal fade-in" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <form style={{ minWidth: 260 }} onSubmit={handleEditNameSubmit}>
                        <h2>Change your name</h2>
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            maxLength={16}
                            placeholder="Your name"
                            required
                            autoFocus
                            style={{ fontSize: '1.3em', padding: '1em' }}
                        />
                        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginTop: 12 }}>
                            <button type="submit" disabled={!editName}>Save</button>
                            <button type="button" onClick={closeNameModal}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            {!username ? (
                <form className="modal fade-in" onSubmit={handleUsernameSubmit}>
                    <h2>Enter your name</h2>
                    <input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        maxLength={16}
                        placeholder="Your name"
                        required
                        autoFocus
                        style={{ fontSize: '1.3em', padding: '1em' }}
                    />
                    <button type="submit" disabled={!inputName}>Continue</button>
                </form>
            ) : !inGame ? (
                <div className="vertical-options fade-in">
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
                                    style={{ fontSize: '1.2em', padding: '0.8em' }}
                                />
                                <button type="submit" disabled={joinCode.length !== 4}>Join</button>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="user-bar">
                        Room: <b>{room}</b>
                        <span className="bar-sep">|</span>
                        <span className="player-name-center" id="player1"></span>
                        <span className="vs-center">vs</span>
                        <span className="player-name-center" id="player2"></span>
                    </div>
                    <Game username={username} room={room} />
                </>
            )}
        </main>
    );
} 