const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Replace with your MongoDB Atlas connection string
const mongoUrl = 'mongodb+srv://thaitri2005:12345@realtimewaterdata.3drttfz.mongodb.net/?retryWrites=true&w=majority&appName=RealTimeWaterData';
const dbName = 'WaterQuality';
let db;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Async function to connect to MongoDB Atlas
async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas', err);
  }
}

connectToMongo(); // Establish the database connection

// Endpoint to receive data from the local bridge
app.post('/data', async (req, res) => {
  console.log('Received data:', req.body);
  try {
    const sensorData = req.body;

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
  console.log(`Server running on port ${port}`);
});
