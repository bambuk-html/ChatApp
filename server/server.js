const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passwort',
  database: 'chat_app_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

db.query(
  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL
  )`,
  (err, results) => {
    if (err) {
      console.error('Failed to create table: ' + err.stack);
      return;
    }
    console.log('Table created successfully');
  }
);

const messages = [];

app.get('/messages', (req, res) => {
  db.query(
    'SELECT * FROM messages',
    (err, results) => {
      if (err) {
        console.error('Failed to fetch messages: ' + err.stack);
        res.sendStatus(500);
        return;
      }
      res.json(results);
    }
  );
});

app.post('/send-message', (req, res) => {
  console.log('Request body:', req.body);
  const { user, message } = req.body;

  if (!user || !message) {
    console.error('User or message not provided in request body');
    return res.status(400).send('User or message not provided');
  }

  db.query(
    'INSERT INTO messages (user, message) VALUES (?, ?)',
    [user, message],
    (err, results) => {
      if (err) {
        console.error('Failed to insert message:', err.stack);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    }
  );
});

io.on('connection', (socket) => {
  console.log('A user connected');

    soocket.on('join_room', (data) => {
      socket.join(data);
      console.log('User joined room:', data);
    });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
