import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { VALID_WORDS } from './validWords.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// rooms: { [roomCode]: { word, players: [{id, name}], started: bool } }
const rooms = {};

function pickRandomWord(wordList = VALID_WORDS) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', ({ room, name }) => {
        if (!rooms[room]) {
            // Create room
            rooms[room] = { word: pickRandomWord(), players: [], started: false };
        }
        if (rooms[room].players.length >= 2) {
            socket.emit('room_full');
            return;
        }
        rooms[room].players.push({ id: socket.id, name });
        socket.join(room);
        // If two players, start game
        if (rooms[room].players.length === 2) {
            rooms[room].started = true;
            io.to(room).emit('match_found', {
                room,
                word: rooms[room].word,
                players: rooms[room].players.map(p => p.name)
            });
        }
    });

    socket.on('game_event', ({ room, data }) => {
        socket.to(room).emit('game_event', data);
    });

    socket.on('game_over', ({ room, result }) => {
        socket.to(room).emit('opponent_game_over', result);
    });

    socket.on('disconnect', () => {
        // Remove player from any room
        for (const [room, info] of Object.entries(rooms)) {
            info.players = info.players.filter(p => p.id !== socket.id);
            if (info.players.length === 0) {
                delete rooms[room];
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Socket.IO server running on port 3001');
}); 