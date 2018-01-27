#include <Wire.h>
#include "MMA7660.h"
MMA7660 accelemeter;
const int buttonPin = 2;
const int accelPin = 7;
int buttonState = 0;

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
  Serial.print(buttonState);
  if (buttonState == HIGH) {
    digitalWrite(LED_BUILTIN, HIGH);
  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }
  int8_t x;
  int8_t y;
  int8_t z;
  float ax,ay,az;
  accelemeter.getXYZ(&x,&y,&z);
  
  Serial.print("x-coordinate : ");
    Serial.println(x); 
    Serial.print("y-coord : ");
    Serial.println(y);   
    Serial.print("z-coord : ");
    Serial.println(z);
}
