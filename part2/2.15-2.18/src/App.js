import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm.js'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  // Fetch person data from database
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  },  [])
  console.log('rendered', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      if(window.confirm(newName + " is already added to the phonebook, replace the old number with a new one?")) {
        const person = persons.find(person => person.name.toLowerCase() === newName.toLocaleLowerCase())
        const changedPerson = { ...person, number : newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name.toLowerCase() !== newName.toLowerCase() ? person : returnedPerson ))
          })
          console.log("Changed number for '" + person.name + "' to " + newNumber)
      } else {
        console.log("Number change prompt canceled")
      }
    } else {
      const nameObject = {
        name : newName,
        number : newNumber
      }
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    if(window.confirm("Delete " + persons.find(person => person.id === id).name)) {
      personService
        .del(id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== id))
        })
      console.log(`deleted id: ${id}`)
    } else {
      console.log("canceled deletion of " + id)
    }
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={newFilter} onChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm onSubmit={addPerson} name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <ul>
        <Persons persons={personsToShow} onDelete={deletePerson}/>
      </ul>

    </div>
  )
}

export default App
