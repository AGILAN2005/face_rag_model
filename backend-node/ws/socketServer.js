// ws/socketServer.js
const WebSocket = require('ws');
// const axios = require('axios'); // Commenting out for dummy response

function startWebSocket() {
  const wss = new WebSocket.Server({ port: 3001 });
  console.log('WebSocket Server listening on ws://localhost:3001');

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
      const query = message.toString();
      console.log('Received:', query);

      // Dummy responses
      let dummyAnswer = '';

      if (query.toLowerCase().includes('last')) {
        dummyAnswer = 'The last registered user is Karthik.';
      } else if (query.toLowerCase().includes('how many')) {
        dummyAnswer = 'There are 5 people currently registered.';
      } else if (query.toLowerCase().includes('karthik')) {
        dummyAnswer = 'Karthik was registered at 10:32 AM today.';
      } else {
        dummyAnswer = 'This is a dummy RAG response.';
      }

      // Simulate delay
      setTimeout(() => {
        ws.send(dummyAnswer);
      }, 500);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

module.exports = startWebSocket;
