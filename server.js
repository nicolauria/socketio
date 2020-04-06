var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let clients = 0;

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on("chat message", function (msg) {
    io.emit("chat message", msg);
  });

  socket.on("NewClient", function () {
    // don't attempt to make a connection until there is 2 clients
    if (clients < 2) {
      if (clients == 1) {
        this.emit("CreatePeer");
      }
    } else {
      this.emit("SessionActive");
    }
    clients++;
  });

  socket.on("Offer", function (offer) {
    this.broadcast.emit("ReceiveOffer", offer);
  });

  socket.on("Answer", function (offer) {
    this.broadcast.emit("ReceiveAnswer", offer);
  });
});

const port = process.env.PORT || 3000;

<<<<<<< HEAD
http.listen(port, function () {
=======
http.listen(3000, function () {
>>>>>>> a78a69ab03f4dd86bab144e2902c49019ce85192
  console.log("listening on *:3000");
});
