//var ws_host = "localhost:3000"; //port 3000 seems to be popular with developers online for some reason

function connect()  {
  ws = new WebSocket('ws://localhost:3000', 'dumby-protocol');
  ws.binaryType = "blob";

  ws.onopen = function(e) {
    console.log('Connection OPEN');
    send({cmd: 'START'});
  };
}