#include <DFRobot_PH.h> // pH sensor library
#include <EEPROM.h> // EEPROM library for storing calibration data
#include "GravityTDS.h" // TDS sensor library
#include <SoftwareSerial.h> // SoftwareSerial library for serial communication

SoftwareSerial mySUART(2, 3); // Initialize software serial (SRX=D2, STX=D3)

// Sensor pins
#define PH_PIN A1
#define TdsSensorPin A1 

// Sensor objects
DFRobot_PH ph;
GravityTDS gravityTds;

// Global variables for sensor values
float temperature = 25.0;
float phValue = 0.0;
float tdsValue = 0.0;

void setup() {
  Serial.begin(115200);
  mySUART.begin(115200);
  gravityTds.setPin(TdsSensorPin);
  gravityTds.setAref(5.0);
  gravityTds.setAdcRange(1024);
  gravityTds.begin();
  ph.begin();
}

void loop() {
  static unsigned long timepoint = millis();
  if (millis() - timepoint > 1000U) {
    timepoint = millis();
    readSensors();
    printSensorValues();
    sendSensorData();
  }
}

void readSensors() {
  // TDS Measurement
  gravityTds.setTemperature(temperature);
  gravityTds.update();
  tdsValue = gravityTds.getTdsValue();

  // pH Measurement
  float voltage = analogRead(PH_PIN) / 1024.0 * 5000;
  phValue = ph.readPH(voltage, temperature);
}

void printSensorValues() {
  Serial.print("Temp: ");
  Serial.print(temperature, 1);
  Serial.print(" °C, pH: ");
  Serial.print(phValue, 2);
  Serial.print(", TDS: ");
  Serial.print(tdsValue, 0);
  Serial.println(" ppm");
}

void sendSensorData() {
  // Create a JSON-formatted string
  String jsonData = "{\"Temp\":";
  jsonData += temperature;
  jsonData += ",\"pH\":";
  jsonData += phValue;
  jsonData += ",\"TDS\":";
  jsonData += tdsValue;
  jsonData += "}";
  
  mySUART.println(jsonData);
}


// Remember to implement or call your calibration function as needed.
