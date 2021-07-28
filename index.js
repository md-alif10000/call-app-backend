const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Server is on");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", (id) => {
    socket.broadcast.emit("callEnded");
    console.log(id + " disconnected");
  });

  socket.on("callUser", (data) => {
    console.log("calling to...", +data);
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("App is listening On Port -" + PORT);
});
