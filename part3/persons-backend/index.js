const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// tiny:
// :method :url :status :res[content-length] - :response-time ms
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Root page
app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

// Persons page
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

// Info page
app.get('/info', (req, res) => {
  date = new Date()
  Person.find({}).then((persons) =>
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    )
  )
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Delete a person's page
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
    id: body.id,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

const getRandomId = (max) => {
  return Math.floor(Math.random() * max)
}

// Add a person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
