

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    }
});


const driverLocations = {};

io.on('connection', (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("driverLocationUpdate", ({ rideId, latitude, longitude }) => {
        driverLocations[rideId] = { latitude, longitude };
        io.to(rideId).emit("locationUpdate", { latitude, longitude });
        console.log("Driver location updated: ", rideId, latitude, longitude);

    });

    socket.on("joinDriverRoom", (rideId) => {
        socket.join(rideId);
        console.log("User joined driver room: ", rideId);

        if (driverLocations[rideId]) {
            // Send the current location immediately
            socket.emit("locationUpdate", driverLocations[rideId]);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
    });
});

server.listen(3001, () => {
    console.log("WebSocket server is running on port 3001");
});