import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url,
      likes: 0
    }
    console.log('newBlog:', newBlog)

    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            id="title-input"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            id="author-input"
            onChange={({ target }) => setAuthor(target.value)}
          />
          <div>
          </div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            id="url-input"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <button id="create-button" type='submit'>create</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
