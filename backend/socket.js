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

let waitingPlayer = null;
const rooms = {};

function pickRandomWord(wordList = VALID_WORDS) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    if (waitingPlayer) {
        const room = `room-${waitingPlayer.id}-${socket.id}`;
        socket.join(room);
        waitingPlayer.join(room);
        const word = pickRandomWord();
        rooms[room] = { word, players: [waitingPlayer.id, socket.id] };
        io.to(room).emit('match_found', { room, word });
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
    }

    socket.on('game_event', ({ room, data }) => {
        socket.to(room).emit('game_event', data);
    });

    socket.on('game_over', ({ room, result }) => {
        socket.to(room).emit('opponent_game_over', result);
    });

    socket.on('disconnect', () => {
        if (waitingPlayer === socket) waitingPlayer = null;
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