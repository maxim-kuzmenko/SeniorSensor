#include <Wire.h>
#include "MMA7660.h"
MMA7660 accelemeter;
const int buttonPin = 2;
const int pinAdc = A0;
int buttonState = 0;
int isActive = 0;
int isReadingButtonValue = 1;
int delayCounter = 0;
int delayValue = 1;
int8_t x, y, z;
float ax,ay,az;
long soundSum;

void setup() {
  // put your setup code here, to run once:
  pinMode(buttonPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  accelemeter.init();
  Serial.begin(9600);
  Serial.println("Button and LED prepared.");
  // Accelpin
}

void loop() {
  // put your main code here, to run repeatedly:
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    if (isReadingButtonValue == 1) {
      isReadingButtonValue = 0;
      if (isActive == 1) {
        isActive = 0;
      } else {
        isActive = 1;
      }
    }
  } else {
    isReadingButtonValue = 1;
  }
  if (isActive == HIGH) {
    digitalWrite(LED_BUILTIN, HIGH);
    delayCounter = (delayCounter + 1) % delayValue;
    if (delayCounter == 0) {
      
      soundSum = 0;
      for (int i = 0; i < 32; i++) {
          soundSum += analogRead(pinAdc);
      }
      soundSum >>= 5;
      
      accelemeter.getXYZ(&x,&y,&z);
      accelemeter.getAcceleration(&ax, &ay, &az);
      
      printPrepare();
      printKeyValuePairInt("isActive", isActive, false);
      printKeyValuePairLong("sound", soundSum, false);
      printCoordinateData();
      printAccelerationData();
      printComplete();
    }
  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }
  delay(1);
}

void printCoordinateData() {
  printKeyValuePairInt("xCoord", x, false);
  printKeyValuePairInt("yCoord", y, false);
  printKeyValuePairInt("zCoord", z, false);
}

void printAccelerationData() {
  printKeyValuePairFloat("xAccel", ax, false);
  printKeyValuePairFloat("yAccel", ay, false);
  printKeyValuePairFloat("zAccel", az, true);
}

void printPrepare() {
  Serial.print("{");
}

void printComplete() {
  Serial.println("}");
}

void printKeyValuePairInt(const char* key, int8_t value, bool last) {
  Serial.print("\"");
  Serial.print(key);
  Serial.print("\"");
  Serial.print(": ");
  Serial.print(value);
  if (!last) {
    Serial.print(", ");
  }
}

void printKeyValuePairLong(const char* key, long value, bool last) {
  Serial.print("\"");
  Serial.print(key);
  Serial.print("\"");
  Serial.print(": ");
  Serial.print(value);
  if (!last) {
    Serial.print(", ");
  }
}

void printKeyValuePairFloat(const char* key, float value, bool last) {
  Serial.print("\"");
  Serial.print(key);
  Serial.print("\"");
  Serial.print(": ");
  Serial.print(value);
  if (!last) {
    Serial.print(", ");
  }
}
