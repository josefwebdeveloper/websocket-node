const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = {}; // Store active connections

wss.on('connection', (ws, req) => {
    // Example: Extract user ID from query params
    const userId = req.url.split('?')[1]; // Adjust based on your auth strategy

    users[userId] = ws;

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`)
        // Handle incoming message, possibly relay to other users
        // For instance, forward a message to a specific user
        const targetUserId = userId; // Determine based on your app logic
        console.log(targetUserId)
        if (users[targetUserId]) {
            console.log(`Forwarding message to user ${targetUserId}`)
            users[targetUserId].send(JSON.stringify({ message: 'Hello from server' }));
        }
    });

    ws.on('close', () => {
        delete users[userId]; // Remove user on disconnect
    });
});

server.listen(3000, () => {
    console.log('WebSocket server started on port 3000');
});
