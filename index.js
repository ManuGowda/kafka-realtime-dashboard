var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic = 'synmon';
var client = new Client('52.187.27.53:2181', "kafka-realtime-dashboard");
var payloads = [{ topic: topic }];
var consumer = new Consumer(
	client,
	[
	{ topic: 'synmon'}, { topic: 'inking' }
	],
	{
		autoCommit: false
	}
	);
var offset = new Offset(client);
var port = 3001;

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io = io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

consumer = consumer.on('message', function(message) {
	console.log(message.value);
	console.log(message.topic);
	if(message.topic === "synmon"){
		io.emit("synmon-message", message.value);
	} else{
		io.emit("inking-message", message.value);
	}
});

http.listen(port, function(){
	console.log("Running on port " + port)
});
