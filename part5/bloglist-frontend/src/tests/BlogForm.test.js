import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import BlogForm from '../components/BlogForm'


describe('Testing BlogForm', () => {
  let container

  const mockCreateBlog = jest.fn()

  const blog = {
    title: 'blogtitle',
    author: 'blogauthor',
    url: 'blogurl.com',
    likes: 0
  }

  beforeEach(() => {
    container = render(
      <BlogForm createBlog={mockCreateBlog} />
    ).container
  })
  test('creating new blog calls the event handler with the right details', async () => {

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const createButton = screen.getByText('create')

    await userEvent.type(titleInput, blog.title)
    await userEvent.type(authorInput, blog.author)
    await userEvent.type(urlInput, blog.url)
    await userEvent.click(createButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual(blog)
  })
})


