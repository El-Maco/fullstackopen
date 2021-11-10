import React from 'react'
import Person from './Person'

const Persons = ({ persons }) => {
  return (
    persons.map(person => <Person person={person} />)
  )
}


export default Persons
