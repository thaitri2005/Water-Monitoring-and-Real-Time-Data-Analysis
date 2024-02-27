const SerialPort = require('serialport');

SerialPort.list().then(ports => {
  ports.forEach(port => {
    console.log(`${port.path}: ${port.manufacturer}`);
  });
}, err => {
  console.error('Error listing ports', err);
});
