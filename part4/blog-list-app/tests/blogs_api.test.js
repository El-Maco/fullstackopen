const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)


let user_token
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user_login = {
    username: 'root',
    name: 'root_user',
    password: 'sekret'
  }

  const passwordHash = await bcrypt.hash(user_login.password, 10)
  const user = new User({
    username: user_login.username,
    name: user_login.name,
    passwordHash
  })

  await user.save()

  const login_res = await api
    .post('/api/login')
    .send(user_login)

  user_token = login_res.body.token

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)


})


describe('blog tests', () => {


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific title is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'React patterns'
    )
  })

  test('all blogs have id property', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
    expect(response.body[0].__v).not.toBeDefined()
  })


  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await post test title',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/async_await_test',
      likes: 9,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${user_token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'async/await post test title'
    )
  })

  test('adding blog without likes-property defaults to 0 likes', async () => {
    const newBlog = {
      title: 'title of blog with no likes',
      author: 'Teemu Teekkari',
      url: 'https://zerolikes.com/0',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${user_token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('title and/or url is missing and returns 404', async () => {
    const newBlog1 = {
      author: 'Teemu Teekkari',
      url: 'https://zerolikes.com/0',
    }
    const newBlog2 = {
      title: 'title of blog with no likes',
      author: 'Teemu Teekkari',
    }

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .set('Authorization', `bearer ${user_token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .set('Authorization', `bearer ${user_token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deletion of a specific blog', () => {
  let blogToDelete_id
  beforeEach(async () => {
    const blog = {
      author: 'root author',
      title: 'root title',
      url: 'root.com'
    }

    const blogToDelete = await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `bearer ${user_token}`)
    blogToDelete_id = blogToDelete.body.id
  })
  test('succeeds with status code 204 for valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogToDelete_id}`)
      .set('Authorization', `bearer ${user_token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(r => r.id)
    expect(ids).not.toContain(blogToDelete_id)
  })
})

describe('Changes to specific blog', () => {
  test('add a like to a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[0]
    blogToChange.likes = blogToChange.likes + 10

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)
      .expect(200)
  })
})

describe('testing users', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'myllyvm1',
      name: 'Marcus Myllyviita',
      password: 'salainen',
      blogs: [],
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
      blogs: [],
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mm',
      name: 'Marcus Myllyviita',
      password: 'longenoughpassword',
      blogs: []
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'myllyvm1',
      name: 'Marcus Myllyviita',
      password: 'pw',
      blogs: []
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
