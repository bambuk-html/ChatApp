const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');
const server = http.createServer(app);
const io = socketIo(server);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '153624',
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
    id INT AUTO_INCREMENT,
    user VARCHAR(255),
    message VARCHAR(255),
    PRIMARY KEY(id)
  )`,
  (err, results) => {
    if (err) {
      console.error('Failed to create table: ' + err.stack);
      return;
    }
    console.log('Table created successfully');
  }
);

app.use(cors());
app.use(express.json());

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
  console.log(req.body);
  const { user, message } = req.body;
  db.query(
    'INSERT INTO messages (user, message) VALUES (?, ?)',
    [user, message],
    (err, results) => {
      if (err) {
        console.error('Failed to insert message: ' + err.stack);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    }
  );
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
