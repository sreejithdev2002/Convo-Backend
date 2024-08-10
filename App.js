const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const dbConnection = require("./Config/dbConnection");
const cors = require("cors");

const authRoutes = require("./Routes/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

dbConnection.dbConnect();

const port = 8000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRoutes);

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", ({ userId }) => {
    socket.join(userId);
  });

  socket.on("privateMessage", (message) => {
    io.to(message.recieverId).emit("privateMessage", message);
    io.to(message.senderId).emit("privateMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
