const express = require('express');
const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'WaterQuality';
let db;

// Async function to connect to MongoDB
async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

connectToMongo(); // Make sure to call this function early to establish the database connection

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = new SerialPort({ path: 'COM3', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', async (data) => { // Note the use of async here
  console.log('Received data:', data);
  try {
    const parts = data.split(', ');
    const sensorData = {
      Temp: parseFloat(parts[0].split(': ')[1]),
      pH: parseFloat(parts[1].split(': ')[1]),
      TDS: parseInt(parts[2].split(': ')[1]),
      TimeRecorded: new Date() // Add the current time as TimeRecorded
    };

    console.log('Parsed Data:', sensorData);

    if (db) {
      await db.collection('VinUniWater').insertOne(sensorData); // Use await to ensure the operation completes
      console.log('Data inserted into MongoDB');
      io.emit('sensorData', sensorData);
    } else {
      console.log('Database connection not established yet.');
    }
  } catch (error) {
    console.error('Failed to parse data:', error);
  }
});


io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const webPort = 3000;
server.listen(webPort, () => {
  console.log(`Server running on http://localhost:${webPort}`);
});
