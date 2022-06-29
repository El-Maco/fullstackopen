import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'


describe('Testing blogs', () => {
  let container

  const mockUpdateBlog = jest.fn()
  const mockDeleteBlog = jest.fn()

  const blog = {
    title: 'blogtitle',
    author: 'blogauthor',
    url: 'blogurl.com',
    likes:0,
    user: {
      username: 'user1234',
      name: 'blogowner',
    },
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} username={blog.user.username} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />
    ).container
  })

  test('render title and author but not url nor likes', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(blog.title)
    expect(div).toHaveTextContent(blog.author)
    const togglable = container.querySelector('.togglableContent')
    expect(togglable).toHaveStyle('display: none')
  })

  test('clicking view button shows url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: block')
  })

  test('clicking like twice triggers event handler twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })

})
