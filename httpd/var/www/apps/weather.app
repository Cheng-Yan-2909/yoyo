#!/bin/sh

echo "Content-type: application/json"
echo
echo

echo -n var weatherData = 
curl "http://api.openweathermap.org/data/2.5/weather?q=Austin&appid=7554e68dc2ca49ceb63aa06189873b2a"

echo ';'
echo

