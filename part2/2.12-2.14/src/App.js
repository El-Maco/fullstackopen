import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Countries from "./components/Countries";

const baseUrl = "https://restcountries.com/v3.1";

function App() {
  const [countries, setCountries] = useState([]);
  const [currFilter, setFilter] = useState("");

  useEffect(() => {
    // For every country.name.common add weather data elements
    axios.get(`${baseUrl}/all`).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleShowClick = (name) => {
    setFilter(name)
  };

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(currFilter.toLowerCase())
  );

  return (
    <div>
      <Filter value={currFilter} onChange={handleFilter} />
      <Countries countries={countriesToShow} onShow={handleShowClick} />
    </div>
  );
}

export default App;
