import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-theta-jet-40.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "https://chat-app-theta-jet-40.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection",(socket)=>{
    console.log("User Connected",socket.id)

    socket.on("message",({room,message}) =>{
      console.log({room,message})
      socket.to(room).emit("receive-message",message);
    })

    socket.on("join-room",(room) =>{ 
      socket.join(room);
    })

    socket.on("disconnect",() => {
      console.log("User Disconnected",socket.id);

    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});