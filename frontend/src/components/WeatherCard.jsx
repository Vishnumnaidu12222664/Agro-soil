import React, { useEffect, useState } from "react";

const API_KEY = "a8f989894841fa202a09f8d930fa1528"; // ✅ your OpenWeatherMap API key

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => fetchWeather(17.6868, 83.2185) // fallback: Visakhapatnam
      );
    } else {
      fetchWeather(17.6868, 83.2185);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        console.error("Weather API error:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-white text-center animate-pulse">Loading weather...</p>;
  if (!weather)
    return <p className="text-red-400 text-center">Failed to load weather data</p>;

  const { main, sys, weather: weatherInfo } = weather;
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
  const condition = weatherInfo[0].main;

  return (
    <div className="bg-black/60 backdrop-blur-lg text-white rounded-2xl p-6 shadow-xl w-[340px] mx-auto border border-white/20 transition-all duration-700 hover:scale-105 hover:bg-black/70">
      <h2 className="text-2xl font-semibold text-center mb-3">🌤️ Weather Report</h2>
      <p className="text-lg text-center italic text-blue-200">{condition}</p>
      <div className="mt-4 space-y-2 text-sm md:text-base text-gray-200">
        <p>🌡️ <b>Temperature:</b> {main.temp} °C</p>
        <p>💧 <b>Humidity:</b> {main.humidity} %</p>
        <p>🌧️ <b>Rainfall:</b> {weather.rain ? weather.rain["1h"] + " mm" : "No rain"}</p>
        <p>🌅 <b>Sunrise:</b> {sunrise}</p>
        <p>🌇 <b>Sunset:</b> {sunset}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
