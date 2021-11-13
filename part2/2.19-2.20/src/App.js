import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    severity: "",
  });

  // Fetch person data from database
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showNotification = (message) => {
    setNotification({ message, severity: "note" });
    setTimeout(() => {
      setNotification({ message: null, severity: null });
    }, 5000);
  };

  const showError = (message) => {
    setNotification({ message, severity: "error" });
    setTimeout(() => {
      setNotification({ message: null, severity: null });
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      if (
        window.confirm(
          newName +
            " is already added to the phonebook, replace the old number with a new one?"
        )
      ) {
        const person = persons.find(
          (person) => person.name.toLowerCase() === newName.toLocaleLowerCase()
        );
        const changedPerson = { ...person, number: newNumber };
        personService
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.name.toLowerCase() !== newName.toLowerCase()
                  ? person
                  : returnedPerson
              )
            );
            showNotification(`Number replaced for '${person.name}'`);
          })
          .catch((error) => {
            console.log(
              `Information of ${person.name} has already been deleted from server.`
            );
            showError(
              `Information of ${person.name} has already been deleted from server.`
            );
            setPersons(persons.filter((person) => person.name !== newName));
          });
        console.log("Changed number for '" + person.name + "' to " + newNumber);
      } else {
        console.log("Number change prompt canceled");
        showError("Number change prompt canceled");
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(nameObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showNotification(`Added '${nameObject.name}' to phonebook.`);
        })
        .catch((error) => {
          console.log(
            `Information of ${newName} has already been deleted from server.`
          );
          showError(
            `Information of ${newName} has already been deleted from server.`
          );
          setPersons(persons.filter((person) => person.name !== newName));
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id) => {
    const name = persons.find((person) => person.id === id).name;
    if (window.confirm(`Delete ${name}`)) {
      personService
        .del(id)
        .then((returnedPerson) => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`${name} was deleted`);
        })
        .catch((error) => {
          console.log(
            `Information of ${name} has already been deleted from server.`
          );
          showError(
            `Information of ${name} has already been deleted from server.`
          );
          setPersons(persons.filter((person) => person.name !== newName));
        });
      console.log(`deleted id: ${id}`);
    } else {
      console.log("canceled deletion of " + id);
      showError(
        "Canceled deletion of " +
          persons.find((person) => person.id === id).name
      );
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notification.message}
        severity={notification.severity}
      />

      <Filter value={newFilter} onChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <ul>
        <Persons persons={personsToShow} onDelete={deletePerson} />
      </ul>
    </div>
  );
};

export default App;
