#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32-HUB75-MatrixPanel-DMA.h>

const char* WIFI_SSID     = "Wifi_hackclub";
const char* WIFI_PASSWORD = "iloveorph<3";

const char* SERVER_URL = "http://nestgivemeaserver";

const int PANEL_RES_X = 64; 
const int PANEL_RES_Y = 64; 
const int PANEL_CHAIN = 1;  

const int SOUND_SENSOR_PIN = 34; 

bool screenOn = false;
unsigned long wakeStartTime = 0;
const unsigned long WAKE_DURATION = 15000; 
String lastFetchedText = "";

void initMatrix() {
    HUB75_I2S_CFG mxconfig(PANEL_RES_X, PANEL_RES_Y, PANEL_CHAIN);

  
    mxconfig.gpio.r1  = 25;
    mxconfig.gpio.g1  = 26;
    mxconfig.gpio.b1  = 27;
    mxconfig.gpio.r2  = 14;
    mxconfig.gpio.g2  = 12;
    mxconfig.gpio.b2  = 13;
    mxconfig.gpio.a   = 23;
    mxconfig.gpio.b   = 19;
    mxconfig.gpio.c   = 5;
    mxconfig.gpio.d   = 17;
    mxconfig.gpio.e   = 18; 
    mxconfig.gpio.lat = 4;
    mxconfig.gpio.oe  = 15;
    mxconfig.gpio.clk = 16;

    matrix = new MatrixPanel_I2S_DMA(mxconfig);
    matrix->begin();
    matrix->setBrightness8(0); 
    matrix->clearScreen();
}

void fetchAndUpdateDisplay() {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    http.begin(SERVER_URL);
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();

        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, payload);

        if (!error) {
            String message = doc["content"] | "NO DATA";

            matrix->clearScreen();
            matrix->setTextSize(1);
            matrix->setTextWrap(true);
            matrix->setTextColor(matrix->color444(0, 15, 0)); 
            matrix->setCursor(2, 28);
            matrix->print(message);
        }
    }
    http.end();
}

void setup() {
    Serial.begin(115200);
    pinMode(SOUND_SENSOR_PIN, INPUT);

    initMatrix();

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
}

void loop() {
    unsigned long currentMillis = millis();

    if (digitalRead(SOUND_SENSOR_PIN) == HIGH) {
        if (!screenOn) {
            screenOn = true;
            matrix->setBrightness8(90); 
            fetchAndUpdateDisplay();   
        }
        wakeStartTime = currentMillis;  
    }

    if (screenOn && (currentMillis - wakeStartTime > WAKE_DURATION)) {
        screenOn = false;
        matrix->clearScreen();
        matrix->setBrightness8(0); 
    }

    delay(50); 
}