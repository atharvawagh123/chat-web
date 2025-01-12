const io = require('socket.io')(5000, {
    cors: {
        origin: "http://127.0.0.1:5500", // Allow frontend origin
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    // When a new user joins the chat
    socket.on('new-user-joined', (name) => {
        console.log(`New user joined: ${name}`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);  // Broadcast to all other users
    });

    // When a message is sent
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
