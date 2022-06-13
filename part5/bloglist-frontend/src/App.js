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
    severity: ""
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
    setNotification({ message, severity: "blog" })
    setTimeout(() => {
      setNotification({ message: null, severity: null });
    }, 5000)
  }

  const showError = (message) => {
    setNotification({ message, severity: "error" })
    setTimeout(() => {
      setNotification({ message: null, severity: null });
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
      console.log(user);
    } catch (exception) {
      //setErrorMessage('Wrong credentials')
      showError('Wrong username or password')
    }
  }

  const handleLogout = (event) => {
    console.log('logged out')
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload(false) // Refresh the page
    setNotification({ message: 'Logged out', severity: 'blog' })
  }

  const blogFormRef = useRef()
  
  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

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

  const updateBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject)
      showNotification(`Updated blog '${blogObject.title}' by ${blogObject.author}`)
      setBlogs(blogs.map(blog => blog.id === blogObject.id ? blogObject : blog))
    } catch (exception) {
      showError('Failed to add like')
      console.log(exception)
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
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
        )}
        </ul>  
      </div>
    }
      
    </div>
  )
}

export default App