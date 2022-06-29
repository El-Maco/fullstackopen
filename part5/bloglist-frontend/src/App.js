import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
//import login from './services/login'
import loginService from './services/login'

const App = () => {
  //const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    severity: ''
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message) => {
    setNotification({ message, severity: 'blog' })
    setTimeout(() => {
      setNotification({ message: null, severity: null })
    }, 5000)
  }

  const showError = (message) => {
    setNotification({ message, severity: 'error' })
    setTimeout(() => {
      setNotification({ message: null, severity: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //setErrorMessage('Wrong credentials')
      showError('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload(false) // Refresh the page
    setNotification({ message: 'Logging out', severity: 'blog' })
  }

  const blogFormRef = useRef()

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`A new blog '${blogObject.title}' by ${blogObject.author} was added`)
    } catch (exception) {
      showError(`Failed to create blog '${blogObject.title}' by ${blogObject.author}`)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const updateBlog = async blogObject => {
    try {
      await blogService.update(blogObject)
      showNotification(`Updated blog '${blogObject.title}' by ${blogObject.author}`)
      setBlogs(blogs.map(blog => blog.id === blogObject.id ? blogObject : blog))
    } catch (exception) {
      showError('Failed to update blog')
    }
  }

  const deleteBlog = async blogObject => {
    try {
      if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)){
        await blogService.del(blogObject)
        showNotification(`Deleted blog '${blogObject.title}' by ${blogObject.author}`)
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      }
    } catch (exception) {
      showError('Failed to delete blog')
    }
  }

  return (
    <div>
      <h1>Bloglist app</h1>

      <Notification message={notification.message} severity={notification.severity} />

      {
        user === null ?
          <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleLogin={handleLogin} /> :
          <div>
            <p>{user.name} logged in
              <button onClick={handleLogout}>log out</button></p>
            {blogForm()}
            <h3>blogs</h3>
            <ul>
              {blogs.sort((a, b) => a.likes < b.likes).map(blog =>
                <Blog key={blog.id} blog={blog} updateBlog={updateBlog} username={user.username} deleteBlog={deleteBlog} />
              )}
            </ul>
          </div>
      }

    </div>
  )
}

export default App
