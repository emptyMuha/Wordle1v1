import React, { useEffect, useState, useCallback, useRef } from 'react';
import WordleGrid from './WordleGrid';
import Keyboard from './Keyboard';
import { checkGuess } from './gameLogic/wordle.js';
import { VALID_WORDS } from './gameLogic/validWords.js';
import { io } from 'socket.io-client';
import './Game.css';

const emptyGuesses = Array(6).fill('').map(() => Array(5).fill(''));
const emptyStatuses = Array(6).fill('').map(() => Array(5).fill(''));

export default function Game() {
    const [guesses, setGuesses] = useState(emptyGuesses);
    const [statuses, setStatuses] = useState(emptyStatuses);
    const [keyStatuses, setKeyStatuses] = useState({});
    const [currentGuess, setCurrentGuess] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('Looking for an opponent...');
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [error, setError] = useState('');
    const [room, setRoom] = useState('');
    const [matched, setMatched] = useState(false);
    const socketRef = useRef(null);

    // Connect to Socket.IO and handle matchmaking
    useEffect(() => {
        const socket = io('http://localhost:3001');
        socketRef.current = socket;
        socket.on('match_found', (data) => {
            setRoom(data.room);
            setAnswer(data.word);
            setMatched(true);
            setStatus('Match found! Game starting...');
        });
        socket.on('opponent_game_over', (result) => {
            setGameOver(true);
            setStatus('You lost! Opponent finished first.');
        });
        return () => socket.disconnect();
    }, []);

    const handleKey = useCallback((key) => {
        if (!matched || gameOver) return;
        setError('');
        if (key === 'Back') {
            setCurrentGuess((g) => g.slice(0, -1));
        } else if (key === 'Enter') {
            if (currentGuess.length === 5) {
                if (!VALID_WORDS.includes(currentGuess)) {
                    setError('Not a valid word');
                    return;
                }
                console.log('Submitting guess:', currentGuess, 'Answer:', answer);
                const result = checkGuess(currentGuess, answer);

                setGuesses(prevGuesses =>
                    prevGuesses.map((row, i) =>
                        i === currentRow ? currentGuess.split('') : row
                    )
                );
                setStatuses(prevStatuses =>
                    prevStatuses.map((row, i) =>
                        i === currentRow ? result : row
                    )
                );
                setKeyStatuses(prevKeyStatuses => {
                    const newKeyStatuses = { ...prevKeyStatuses };
                    for (let i = 0; i < 5; i++) {
                        const letter = currentGuess[i].toUpperCase();
                        if (result[i] === 'correct') newKeyStatuses[letter] = 'correct';
                        else if (result[i] === 'present' && newKeyStatuses[letter] !== 'correct') newKeyStatuses[letter] = 'present';
                        else if (result[i] === 'absent' && !newKeyStatuses[letter]) newKeyStatuses[letter] = 'absent';
                    }
                    return newKeyStatuses;
                });

                if (currentGuess === answer) {
                    setStatus('You win!');
                    setGameOver(true);
                    setWin(true);
                    if (socketRef.current && room) {
                        socketRef.current.emit('game_over', { room, result: 'win' });
                    }
                } else if (currentRow === 5) {
                    setStatus(`You lose! The word was ${answer.toUpperCase()}`);
                    setGameOver(true);
                    if (socketRef.current && room) {
                        socketRef.current.emit('game_over', { room, result: 'lose' });
                    }
                } else {
                    setCurrentRow(r => r + 1);
                    setCurrentGuess('');
                }
            }
        } else if (/^[A-Z]$/i.test(key) && currentGuess.length < 5) {
            setCurrentGuess((g) => g + key.toLowerCase());
        }
    }, [matched, gameOver, currentGuess, answer, room]);

    // Physical keyboard support
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === 'Enter') handleKey('Enter');
            else if (e.key === 'Backspace') handleKey('Back');
            else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleKey]);

    // Show current guess in the grid
    const displayGuesses = guesses.map((row, i) =>
        i === currentRow ? currentGuess.padEnd(5).split('') : row
    );

    return (
        <div className="game-container">
            <div className="status">{status}</div>
            {error && <div className="error">{error}</div>}
            <WordleGrid guesses={displayGuesses} statuses={statuses} />
            <Keyboard keyStatuses={keyStatuses} onKey={handleKey} />
            {gameOver && (
                <button className="restart-btn" onClick={() => window.location.reload()}>Restart</button>
            )}
        </div>
    );
} 