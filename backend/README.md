# Wordle1v1 Backend

This is the backend (Socket.IO server) for the Wordle1v1 game.

## How to Deploy

1. Set the root directory to `backend` when deploying on Railway or similar services.
2. Set the start command to:
   ```
   node socket.js
   ```
3. Make sure the dependency `src/gameLogic/validWords.js` is present and accessible.

## Local Development

```
cd backend
npm install
npm start
```

The server will run on port 3001 by default. 