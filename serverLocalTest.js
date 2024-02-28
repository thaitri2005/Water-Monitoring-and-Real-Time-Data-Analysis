const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// For local MongoDB: mongodb://localhost:27017
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'WaterQuality';
let db;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Async function to connect to MongoDB
async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

connectToMongo(); // Establish the database connection

// Endpoint to receive data (simulated or real)
app.post('/data', async (req, res) => {
    console.log('Received data:', req.body);
    try {
      let sensorData = req.body;
  
      // Convert TimeRecorded from string to Date object
      if (sensorData.TimeRecorded && typeof sensorData.TimeRecorded === 'string') {
        sensorData.TimeRecorded = new Date(sensorData.TimeRecorded);
      }
  
      if (db) {
        await db.collection('VinUniWater').insertOne(sensorData);
        console.log('Data inserted into MongoDB');
        io.emit('sensorData', sensorData); // Emitting sensor data to all connected clients
        res.send('Data received and inserted');
      } else {
        console.log('Database connection not established yet.');
        res.status(500).send('Database connection not established');
      }
    } catch (error) {
      console.error('Failed to process data:', error);
      res.status(500).send('Error processing data');
    }
  });

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
