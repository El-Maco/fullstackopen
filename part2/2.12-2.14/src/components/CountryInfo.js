import React, { useState, useEffect } from "react";
import Weather from "./Weather";
import axios from "axios";

const weatherUrl = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=`;

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState()

  
  useEffect(() => {
    // For every country.name.common add weather data elements
    axios.get(`${weatherUrl}${country.name.common}`).then((response) => {
      setWeather(response.data);
    });
  }, [country]);


  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        capital{" "}
        {country.capital.map((cap) => (
          <p key={cap}>{cap}</p>
        ))}
      </div>
      <div>population {country.population}</div>
      <h2>Languages</h2>
      <ul></ul>
      <img height="150" src={country.flags.svg} alt="Flag" />
      <Weather country={country} weather={weather} />
    </div>
  );
};

export default CountryInfo;
