require('dotenv').config()
const config = require('./utils/config')
const logger = require('./utils/logger')
const { errorHandler, tokenExtractor, unknownEndpoint } = require('./utils/middleware')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

console.log('NODE_ENV:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
} 


app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
