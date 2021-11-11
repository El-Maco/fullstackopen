import React from "react";

const Weather = ({ country, weather }) => {
  if (weather === undefined) {
    return null;
  }
  return (
    <div>
      <h2>{`Weather in ${country.name.common}`}</h2>
      <div>
        <b>temperature: </b>
        {weather.current.temperature}
        <div>
          <img src={weather.current.weather_icons[0]} alt="Weather" />
        </div>
        <p>
          <b>wind: </b>
          {`${weather.current.wind_speed} mph direction ${weather.current.wind_dir}`}
        </p>
      </div>
    </div>
  );
};

export default Weather;
