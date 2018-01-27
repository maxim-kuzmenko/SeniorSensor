#include <Wire.h>
#include "MMA7660.h"
MMA7660 accelemeter;
const int buttonPin = 2;
int buttonState = 0;
int isActive = 0;
int isReadingButtonValue = 1;

void setup() {
  // put your setup code here, to run once:
  pinMode(buttonPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  accelemeter.init();
  Serial.begin(9600);
  Serial.print("Button and LED prepared.");
  // Accelpin
}

void loop() {
  // put your main code here, to run repeatedly:
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    if (isReadingButtonValue == 1) {
      isReadingButtonValue = 0;
      if (isActive == 1) {
        isActive == 0;
      } else {
        isActive == 1;
      }
    }
  } else {
    isReadingButtonValue = 1;
  }
  if (isActive == HIGH) {
    digitalWrite(LED_BUILTIN, HIGH);
  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }
  int8_t x;
  int8_t y;
  int8_t z;
  float ax,ay,az;
  accelemeter.getAcceleration(&ax,&ay,&az);
  
  Serial.println(ax);
    Serial.println(ay);
    Serial.println(az);
    delay(500);
}
