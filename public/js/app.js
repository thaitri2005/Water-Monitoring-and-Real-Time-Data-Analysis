const socket = io();

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

socket.on('sensorData', (data) => {
    const time = new Date(data.TimeRecorded).toLocaleTimeString();
    updateChart(tempChart, time, data.Temp);
    updateChart(phChart, time, data.pH);
    updateChart(tdsChart, time, data.TDS);
});

function updateChart(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// Existing app.js code remains unchanged until the socket.on('sensorData', (data) => { ... });

// Add these lines at the end of the app.js file
document.getElementById('showTempChart').addEventListener('click', function() {
    showChart('tempChart');
});

document.getElementById('showPhChart').addEventListener('click', function() {
    showChart('phChart');
});

document.getElementById('showTdsChart').addEventListener('click', function() {
    showChart('tdsChart');
});

function showChart(chartId) {
    document.querySelectorAll('.chart').forEach(function(chart) {
        chart.style.display = 'none'; // Hide all charts
    });
    document.getElementById(chartId).style.display = 'block'; // Show the selected chart
}
