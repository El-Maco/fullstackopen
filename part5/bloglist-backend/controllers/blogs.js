const blogsRouter = require('express').Router()
//const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blogs')
//const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(403).json({ error: 'No blogs found with given id' })
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.remove(blog)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'User does not have authorization to delete this instance' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: body.user.id
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

  response.json(updatedBlog)
})

module.exports = blogsRouter
