var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic = 'synmon';
var client = new Client('kafka-pry-0.southeastasia.cloudapp.azure.com:2181', "kafka-realtime-dashboard");
var payloads = [{ topic: topic }];
var consumer = new Consumer(
	client,
	[
	{ topic: 'synmon'}
	],
	{
		autoCommit: true
	}
	);
var offset = new Offset(client);
var port = 3001;

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.get('/inking', function(req, res){
	res.sendfile('inking.html');
});

io = io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

consumer = consumer.on('message', function(message) {
 var str = JSON.stringify(message.value)
        var data = JSON.parse(JSON.parse(str))
console.log(data)
console.log(data.param)
console.log(typeof(data))
//var data = JSON.parse(str)
//var data = {}
if(data.param === "CpuUsage"){
		io.emit("synmon-message", data);
	} else{
		io.emit("inking-message", data);
	}
});

http.listen(port, function(){
	console.log("Running on port " + port)
});