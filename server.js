const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'WaterQuality';
let db;

// Serve static files from the 'public' directory
app.use(express.static('public'));

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

connectToMongo(); // Establish the database connection

const serialPort = new SerialPort({ path: 'COM3', baudRate: 115200 });
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', async (data) => {
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
      await db.collection('VinUniWater').insertOne(sensorData);
      console.log('Data inserted into MongoDB');
      io.emit('sensorData', sensorData); // Emitting sensor data to all connected clients
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
