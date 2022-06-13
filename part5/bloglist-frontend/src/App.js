import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
//import login from './services/login'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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
  
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    console.log(`creating new blog: ${title}, ${author} - ${url}`)
    const newBlog = {
      title,
      author,
      url,
      likes: 0
    }
    try {
      await blogService.create(newBlog)
      const newBlogList = await blogService.getAll()
      setBlogs(newBlogList)
      showNotification(`A new blog '${title}' by ${author} was added`)
    } catch (exception) {
      showError(`Failed to create blog '${title}' by ${author}`)
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
      </div>
    <div>
      password
      <input
      type="password"
      value={password}
      name="Password"
      onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          />
        <div>
        </div>
          url:
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <button type='submit'>create</button>
        </div>
      </form>
      <h3>blogs</h3>
      <ul>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </ul>  
    </div>
  )

  return (
    <div>
      <h1>Bloglist app</h1>

      <Notification message={notification.message} severity={notification.severity} />
  
    {
      user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        {blogForm()}
      </div>
    }
      
    </div>
  )
}

export default App
