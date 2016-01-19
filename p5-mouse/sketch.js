function setup() {
	createCanvas(100, 100);
	setupOsc(3333, 3334);
}

function draw() {
	background(0);
	fill(255);
	ellipse(x,y,100,100);
}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	if (address='/test'){
	x = value[0];
	y = value[1];
}
}

function sendOsc(address, value) {
	socket.emit('message', [address].concat(value));
}

var socket;
function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '127.0.0.1'},//we are both server and client
			client: { port: oscPortOut, host: '127.0.0.1'}//which is why the two IP addresses are the same
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
