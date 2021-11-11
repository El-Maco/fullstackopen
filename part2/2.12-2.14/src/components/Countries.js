import React from "react";
import CountryInfo from "./CountryInfo";
import Country from "./Country";

const Countries = ({ countries, onShow }) => {
  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />;
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return countries.map((c) => <Country key={c.name.common} name={c.name.common} onShow={onShow} />);
  } else {
    return <div>No countries found</div>;
  }
};

export default Countries;
