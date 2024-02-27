const socket = io();

// Chart setup
const tempCtx = document.getElementById('tempChart').getContext('2d');
const phCtx = document.getElementById('phChart').getContext('2d');
const tdsCtx = document.getElementById('tdsChart').getContext('2d');

const tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: [],
        }]
    },
    options: {}
});

const phChart = new Chart(phCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'pH Level',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: [],
        }]
    },
    options: {}
});

const tdsChart = new Chart(tdsCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'TDS (ppm)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            data: [],
        }]
    },
    options: {}
});

// Function to update charts with new data
function addData(chart, label, data) {
    if (chart.data.labels.length >= 20) {
        chart.data.labels.shift(); // Remove the oldest label
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift(); // Remove the oldest data point
        });
    }
    chart.data.labels.push(label); // Add the new label
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data); // Add the new data point
    });
    chart.update(); // Refresh the chart
}

// WebSocket event for incoming sensor data
socket.on('sensorData', (data) => {
    const time = new Date(data.TimeRecorded).toLocaleTimeString();
    addData(tempChart, time, data.Temp);
    addData(phChart, time, data.pH);
    addData(tdsChart, time, data.TDS);
});

// Button event listeners to toggle chart display
document.getElementById('showTempChart').addEventListener('click', function() {
    showChart('tempChart');
});

document.getElementById('showPhChart').addEventListener('click', function() {
    showChart('phChart');
});

document.getElementById('showTdsChart').addEventListener('click', function() {
    showChart('tdsChart');
});

// Function to show the selected chart and hide others
function showChart(chartId) {
    document.querySelectorAll('.chart').forEach(function(chart) {
        chart.style.display = 'none'; // Hide all charts
    });
    document.getElementById(chartId).style.display = 'block'; // Show the selected chart
}
