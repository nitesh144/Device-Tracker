const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// Create HTTP server
const server = http.createServer(app);
const io = socketio(server);

// Serve static files (like CSS and JS)
app.use(express.static(path.join(__dirname, "public")));

// EJS view engine setup
app.set("view engine", "ejs");

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle receiving location
  socket.on("send-location", (data) => {
    console.log(`Location received from ${socket.id}:`, data);
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit("user-disconnected", socket.id);
  });
});

// Render index page
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
