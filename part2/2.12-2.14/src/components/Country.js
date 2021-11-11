import React from "react";

const Country = ({ name, onShow }) => {
  return (
    <div>
      {name}
      <button onClick={() => onShow(name)}>show</button>
    </div>
  );
};

export default Country;
