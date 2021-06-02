var socket = io();
console.log("client: socket connected");
socket.on("newFile", function (data) {
  window.location.href = data.file;
});
