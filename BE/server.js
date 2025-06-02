const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const prisma = require('./db');
const { router: authRouter } = require('./routes/auth');
const { getUsers } = require('./loggedInUsers');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.set('io', io);
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/auth', authRouter);

const messageRateLimitMap = new Map();
const rateLimitCount = 10;
const rateLimitInterval = 30 * 1000; //30 sec

setInterval(() => {
  const now = Date.now();
  for (const [userId, timestamps] of messageRateLimitMap) {
    const recent = timestamps.filter(ts => now - ts < rateLimitInterval);
    if (recent.length === 0) {
      messageRateLimitMap.delete(userId);
    } else {
      messageRateLimitMap.set(userId, recent);
    }
  }
}, 60 * 1000); 

io.on('connection', socket => {
  console.log('Client connected');

  socket.emit('updateLoggedUsers', getUsers());

  //novo sporočilo
  socket.on('sendMessage', async (msg) => {
    const { userId, text } = msg;

    const now = Date.now();
    const timestamps = messageRateLimitMap.get(userId) || [];

    // Filtriranje sporočil starjših kot 30 sekund
    const recentTimestamps = timestamps.filter(ts => now - ts < rateLimitInterval);

    //preveri koliko sporočil je nastalo v zadnjih 30 sec
    if (recentTimestamps.length >= rateLimitCount) {
      socket.emit('rateLimitExceeded', {
        message: 'Rate limit exceeded. Please wait before sending more messages.',
      });
      return;
    }

    //Posodabljanje arrayev z novim timestampov
    recentTimestamps.push(now);
    messageRateLimitMap.set(userId, recentTimestamps);

    //ustvari novo sporočilo
    const message = await prisma.message.create({
      data: {
        text,
        userId,
        date: Math.floor(now / 1000),
        likes: [],
      },
      include: { user: true },
    });

    //pošlji novo sporočilo po socketu
    io.emit('newMessage', {
      id: message.id,
      text: message.text,
      date: message.date,
      user_id: message.userId,
      username: message.user.name,
      likes: message.likes,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
