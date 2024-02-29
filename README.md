# Water Quality Monitoring Dashboard
## Description
The Water Quality Monitoring Dashboard is a web-based application aimed at providing real-time insights into water quality parameters such as temperature, pH, and Total Dissolved Solids (TDS). Designed to support environmental monitoring and research, this dashboard integrates cutting-edge technologies to collect, process, and display water quality data. It leverages an Arduino device for the collection of water quality data, Node.js for the backend, MongoDB for data storage, and Socket.io for real-time web socket communication.

## Features
<ul>
    <li>Real-time display of water temperature, pH, and TDS.
    <li>Responsive design for optimal viewing on both desktop and mobile devices.
    <li>Dark mode support for enhanced visual comfort.
    <li>Online access to the latest water quality data.
</ul>

## Live Demo
Experience the live dashboard and see real-time water quality data visualization at [https://water-monitoring-and-real-time-data.onrender.com/](https://water-monitoring-and-real-time-data.onrender.com/)

## Technologies
- **Arduino**: For on-site water quality data collection, utilizing sensors to measure temperature, pH, and TDS levels.
- **Node.js**: As the runtime environment for the backend server, facilitating data processing and server-side logic.
- **Express.js**: Used to structure the server-side application for easier routing and API development.
- **MongoDB**: The NoSQL database used for storing water quality data efficiently, allowing for quick retrieval and aggregation of historical data.
- **Socket.io**: Enables real-time, bidirectional communication between web clients and the server, ensuring that data updates are instantly displayed on the dashboard.
- **Axios**: A promise-based HTTP client for the browser and Node.js, used for making HTTP requests to fetch or send data without refreshing.
- **Chart.js**: For rendering responsive, interactive charts on the web page, providing a visual representation of the water quality over time.
- **Bootstrap**: Utilized for designing a responsive and mobile-friendly web interface, enhancing the overall user experience with modern, stylized components.
- **Render.com**: The hosting platform where the dashboard is deployed, offering seamless, cloud-based hosting services for the application.


## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB
- An Arduino device configured for water quality sensing

### Local Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/thaitri2005/Water-Monitoring-and-Real-Time-Data-Analysis.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the application:
    ```bash
    npm run start-local
    ```
The application will be accessible on http://localhost:3000.

### Configuration
Ensure your Arduino device is correctly set up to measure and transmit water quality data. Modify `server.js` to match your specific MongoDB configuration and the Arduino communication protocol.

## Contributing
Contributions to enhance the Water Quality Monitoring Dashboard are welcome. Please fork the repository and submit a pull request with your proposed changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact
For questions or to report issues, please contact the lead developer at thaitri2005@gmail.com.
