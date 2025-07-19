// Basic Socket.IO server for Wordle 1v1
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { VALID_WORDS } from '../src/gameLogic/validWords.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Simple in-memory matchmaking queue
let waitingPlayer = null;

// Store room data: { [room]: { word, players: [socketId, ...] } }
const rooms = {};

function pickRandomWord(wordList = VALID_WORDS) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle matchmaking
    if (waitingPlayer) {
        // Start a game between waitingPlayer and this socket
        const room = `room-${waitingPlayer.id}-${socket.id}`;
        socket.join(room);
        waitingPlayer.join(room);
        // Pick a shared word for this room
        const word = pickRandomWord();
        rooms[room] = { word, players: [waitingPlayer.id, socket.id] };
        // Send match_found and the word to both players
        io.to(room).emit('match_found', { room, word });
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
    }

    // Relay game events between players in the same room
    socket.on('game_event', ({ room, data }) => {
        socket.to(room).emit('game_event', data);
    });

    // Handle game over: notify the opponent
    socket.on('game_over', ({ room, result }) => {
        socket.to(room).emit('opponent_game_over', result);
    });

    socket.on('disconnect', () => {
        if (waitingPlayer === socket) waitingPlayer = null;
        // Remove player from any room
        for (const [room, info] of Object.entries(rooms)) {
            if (info.players.includes(socket.id)) {
                delete rooms[room];
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Socket.IO server running on port 3001');
}); 