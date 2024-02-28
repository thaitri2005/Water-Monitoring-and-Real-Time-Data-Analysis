const SerialPort = require('serialport');
const ReadlineParser = require('@serialport/parser-readline');
const axios = require('axios');

const PORT_PATH = 'COM3';
const BAUD_RATE = 115200;
const SERVER_ENDPOINT = 'https://water-monitoring-and-real-time-data.onrender.com/data';

const serialPort = new SerialPort(PORT_PATH, { baudRate: BAUD_RATE });
const parser = new ReadlineParser();
serialPort.pipe(parser);

parser.on('data', async (data) => {
  console.log('Received data:', data);
  try {
    // Assuming data is in the format "Temp: 25, pH: 7, TDS: 500"
    const parts = data.split(', ').map(part => {
      const [key, value] = part.split(': ');
      return { key, value };
    });

    const sensorData = parts.reduce((acc, part) => {
      acc[part.key] = parseFloat(part.value);
      return acc;
    }, {});

    sensorData.TimeRecorded = new Date();

    console.log('Parsed Data:', sensorData);

    // Sending parsed data to the server
    await axios.post(SERVER_ENDPOINT, sensorData)
      .then(response => console.log('Data sent to server:', response.data))
      .catch(error => console.error('Error sending data to server:', error));

  } catch (error) {
    console.error('Error parsing data:', error);
  }
});

serialPort.on('open', () => {
  console.log(`Serial port ${PORT_PATH} opened at ${BAUD_RATE} baud rate.`);
});

serialPort.on('error', (error) => {
  console.error('Serial port error:', error);
});
