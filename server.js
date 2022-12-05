//This part is the same as usual...
var express = require("express");
var app = express();

var http = require("http");

//We are getting an instance of a Node HTTP (web) server here.
//We are also telling it to connect up with our Express application,
//so it can handle requests.
var server = http.Server(app);

//On command prompt, we need to do "npm install socket.io"
var socketio = require("socket.io");

//instantiates our 'io' instance, and also connects it up with the HTTP
//server we already created.
var io = socketio(server);

//Just for static files (like usual).  Eg. index.html, client.js, etc.
app.use(express.static("pub"));

let dogOffset = 0; //the "official" record of where the dogs are located
let left = "left";
let right = "right";
io.on("connection", (socket) => {
	console.log("Somebody connected.");
	socket.emit("updatePosition", dogOffset);

	socket.on("disconnect", () => {
		console.log("Somebody disconnected.");
	});

	//This gets called when a client emits a "move" message
	socket.on("moveLeft", (dataFromClient) => {
		dogOffset--;
		console.log("Position is now " + dogOffset);
		if (dogOffset <= -15) {
			console.log("left Won");
			io.emit("winner", left);
		}
		io.emit("updatePosition", dogOffset); //telling all the clients the new position.
	});

	socket.on("moveRight", (dataFromClient) => {
		dogOffset++;
		console.log("Position is now " + dogOffset);
		if (dogOffset >= 15) {
			io.emit("winner", right);
			console.log("Right Won");
		}
		io.emit("updatePosition", dogOffset); //telling all the clients the new position.
	});

	socket.on("reset", () => {
		dogOffset = 0;
		io.emit("updatePosition", dogOffset);
		io.emit("reset", "New Game, Tug!!");
	});
});

server.listen(80, function () {
	console.log("Server is listening on port 80");
});



