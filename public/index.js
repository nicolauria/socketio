var Peer = require("simple-peer");
var socket = io();
let client = {};
const video = document.querySelector("video");

$(function () {
  $("form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#m").val());
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function (msg) {
    $("#messages").append($("<li>").text(msg));
  });
});

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    socket.emit("NewClient");
    video.srcObject = stream;
    video.play();

    socket.on("CreatePeer", function () {
      console.log("CreatePeer");
      let peer = InitPeer("init");
      peer.on("signal", function (data) {
        socket.emit("Offer", data);
      });
      client.peer = peer;
    });

    function InitPeer(type) {
      let peer = new Peer({
        initiator: type == "init" ? true : false,
        stream: stream,
        trickle: false,
      });

      peer.on("stream", function (stream) {
        let video = document.createElement("video");
        video.srcObject = stream;
        document.querySelector("#peerDiv").appendChild(video);

        video.play();
      });

      return peer;
    }

    socket.on("ReceiveOffer", function (offer) {
      let peer = InitPeer("notInit");

      peer.on("signal", (data) => {
        socket.emit("Answer", data);
      });

      peer.signal(offer);
      client.peer = peer;
    });

    socket.on("ReceiveAnswer", function (answer) {
      let peer = client.peer;
      peer.signal(answer);
    });

    socket.on("SessionActive", function () {
      document.write("Session Active. Please come back later");
    });
  });
