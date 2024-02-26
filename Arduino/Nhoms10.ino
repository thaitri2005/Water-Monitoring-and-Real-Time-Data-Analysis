#include <DFRobot_PH.h>

#include <EEPROM.h>
#include "GravityTDS.h"
#include <SoftwareSerial.h>
SoftwareSerial mySUART(2, 3);  //SRX = Din-2, STX = Dpin-3

#define PH_PIN A1
float voltage, phValue, temperature = 25;
DFRobot_PH ph;
#define TdsSensorPin A1
GravityTDS gravityTds;

float tdsValue = 0;
void setup() {
  Serial.begin(115200);
  gravityTds.setPin(TdsSensorPin);
  gravityTds.setAref(5.0);       //reference voltage on ADC, default 5.0V on Arduino UNO
  gravityTds.setAdcRange(1024);  //1024 for 10bit ADC;4096 for 12bit ADC
  gravityTds.begin();            //initialization
  Serial.begin(115200);
  mySUART.begin(115200);
  ph.begin();
}

void loop() {

  //temperature = readTemperature();  //add your temperature sensor and read it
  gravityTds.setTemperature(temperature);  // set the temperature and execute temperature compensation
  gravityTds.update();                     //sample and calculate
  tdsValue = gravityTds.getTdsValue();     // then get the value
  Serial.print(tdsValue, 0);
  Serial.println("ppm");
  delay(1000);
  static unsigned long timepoint = millis();
  if (millis() - timepoint > 1000U) {  //time interval: 1s
    timepoint = millis();
    //temperature = readTemperature();         // read your temperature sensor to execute temperature compensation
    voltage = analogRead(PH_PIN) / 1024.0 * 5000;  // read the voltage
    phValue = ph.readPH(voltage, temperature);     // convert voltage to pH with temperature compensation
    Serial.print("Temperature: ");
    Serial.print(temperature, 1);
    Serial.print(" °C  pH: ");
    Serial.println(phValue, 2);
  }
  ph.calibration(voltage, temperature);  // calibration process by Serail CMD

  String str =String("coming from Arduino: ")+String("H= ")+String(phValue)+String("T= ")+String(tdsValue);
  mySUART.println(str);
}

float readTemperature() {
  //add your code here to get the temperature from your temperature sensor
}