const { Server } = require('socket.io');

const io = new Server(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on('new:user:join:request', data => {
        console.log("new:user:join:request");
        const { from, room } = data;
        console.log(from, room);
        socket.join(room);

        socket.to(room).emit("new:user:join:request", { from: from});
    });

    socket.on('initiating:handshake:from:room', data => {
        console.log("initiating:handshake:from:room");
        const { from, to, offer } = data;
        console.log("from, to, offer");
        console.log(from, to, offer);

        socket.to(to.id).emit('initiating:handshake:from:room', { from, to, offer });
    });

    socket.on('handshake:accepted:from:user', data => {
        console.log("handshake:accepted:from:user");
        const { from, to, ans } = data;
        console.log("from, to, ans");
        console.log(from, to, ans);

        socket.to(to.id).emit("handshake:accepted:from:user", { from, to, ans });
    });

    socket.on('handshake:success', data => {
        console.log("handshake:success");
        const { from, to } = data;
        console.log("from, to");
        console.log(from, to);

        socket.to(to.id).emit("handshake:success", { from, to });
    });

    socket.on('ice-candidate', data => {
        console.log("ice-candidate");
        const { to, candidate } = data;
        console.log("to, candidate");
        console.log(to, candidate);
        socket.to(to.id).emit('ice-candidate', { from: { id: socket.id }, to, candidate });
    });

    socket.on('peer:nego:needed', ({to, from, offer}) => {
        console.log('peer:nego:needed')
        console.log(to, from, offer)
        socket.to(to).emit('peer:nego:needed', {to, from, offer})
    })

    socket.on('peer:nego:done', ({from, to, ans}) => {
        console.log('peer:nego:done')
        console.log(from, to, ans)
        socket.to(to).emit('peer:nego:final', {to, from, ans})
    })

    socket.on('disconnect', () => {
        console.log("Socket disconnected:", socket.id);
        socket.broadcast.emit('user:disconnected', { id: socket.id });
    });
});

console.log('Server is running on port 8000');


// const { Server } = require('socket.io');

// const io = new Server(8000, {
//     cors: true
// });

// const emailToSocketIdMap = new Map()
// const socketIdToEmailMap = new Map()

// io.on("connection", (socket) => {
//     console.log("Socket connected :", socket.id)

//     socket.on('room:join:request', data => {
//         console.log("room:join:request")
//         const {email, room, offer} = data
//         console.log(data)

//         emailToSocketIdMap.set(email, socket.id)
//         socketIdToEmailMap.set(socket.id, email)

//         io.to(room).emit("new:user:join:request", {from:email, id: socket.id, offer})
//         socket.join(room)
//     })
    
//     socket.on('initiating:handshake:from:room', data => {
//         console.log("initiating:handshake:from:room")
//         const {from, to, ans} = data
//         console.log(data)
        
//         io.to(to).emit('initiating:handshake:from:room', {from: { email: from, id: socket.id }, ans})
//     })
    
//     socket.on('connection:established', data => {
//         console.log("connection:established")
//         const {from} = data
//         console.log(data)
        
//         io.to(socket.id).emit("room:join:success", {from: from, to: socket.id})
//     })
// })