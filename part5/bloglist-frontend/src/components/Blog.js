import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {  
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlog(updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        <p>{blog.title}, {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button></p>
      </div>  
    <div style={showWhenVisible}>
      <ul>
        <li>{blog.url}</li>
        <li>{blog.likes}<button onClick={addLike}>like</button></li>
        <li>{blog.author}</li>
      </ul>
    </div>
    </div>
  )
}

export default Blog
