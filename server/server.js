const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mysql = require("mysql");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passwort',
  database: 'chat_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  
    db.query('SELECT * FROM messages WHERE room = ?', [room], (err, results) => {
      if (err) throw err;
      console.log('Fetched messages:', results);  // Log the fetched messages
      socket.emit('previous_messages', results);
    });
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
      data.time = new Date().toISOString().slice(0, 19).replace('T', ' ');
      db.query('INSERT INTO messages SET ?', data, (err) => {
      if (err) throw err;
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});