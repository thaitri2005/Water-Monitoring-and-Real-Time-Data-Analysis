const axios = require('axios');

// Function to simulate data sending
const sendData = async () => {
  const sensorData = {
    Temp: 25.0 + Math.random() * 5, // Random temperature between 25.0 and 30.0
    pH: 6.5 + Math.random(), // Random pH between 6.5 and 7.5
    TDS: 800 + Math.random() * 200, // Random TDS between 800 and 1000
    TimeRecorded: new Date()
  };

  try {
    await axios.post('http://localhost:3000/data', sensorData);
    console.log('Data sent:', sensorData);
  } catch (error) {
    console.error('Error sending data:', error.message);
  }
};

// Send data every 1 seconds
setInterval(sendData, 1000);
