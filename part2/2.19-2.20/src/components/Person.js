import React from "react";

const Person = ({ person, onDelete }) => {
  const label = "delete";
  return (
    <li className="person">
      {person.name} {`${person.number} `}
      <button onClick={() => onDelete(person.id)}>{label}</button>
    </li>
  );
};

export default Person;
