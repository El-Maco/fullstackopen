const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(403).json({ error: 'No blogs found with given id' })
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.remove(blog)
    response.status(204).json({ error: 'true' })
  } else {
    response.status(401).json({ error: 'User does not have authorization to delete this instance' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    ...body
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(blog)
})

module.exports = blogsRouter
