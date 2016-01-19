function setup() {
	createCanvas(100, 100);
	setupOsc(3333, 3334); //osc ports 33 and 34.
}

function draw() {

}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

}

function sendOsc(address, value) {
	socket.emit('message', [address].concat(value)); //message is what is sent over socket io. sent as address and value, where value is an array of data.
}

var socket;
function setupOsc(oscPortIn, oscPortOut) {
	//callback that sends at port 8081, this can be renamed but
	//you need to update the port number in bridge.js to match this.
	var socket = io.connect('http://127.0.0.1', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
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
