import React, { useState } from 'react';
import Game from './Game';
import './App.css';

export default function App() {
    const [inGame, setInGame] = useState(false);
    return (
        <main className="container">
            {!inGame ? (
                <>
                    <h1>Wordle 1v1</h1>
                    <p>Compete in real-time Wordle matches against another player!</p>
                    <button onClick={() => setInGame(true)}>Start Matchmaking</button>
                </>
            ) : (
                <Game />
            )}
        </main>
    );
} 