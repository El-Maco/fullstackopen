const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((max_blog, curr_blog) => curr_blog.likes > max_blog.likes ? curr_blog  : max_blog, blogs[0])
}

const mostBlogs = (blogs) => {
  const blog_counts = _.countBy(blogs, 'author')
  const authors = Object.keys(blog_counts)

  const max_author = authors.reduce((prev_auth, curr_auth) => blog_counts[curr_auth] > blog_counts[prev_auth] ? curr_auth : prev_auth, Object.keys(blog_counts)[0])
  const most_blogs = {
    author: max_author,
    blogs: blog_counts[max_author]
  }

  return blogs.length === 0
    ? 0
    : most_blogs
}

const mostLikes = (blogs) => {
  const authors = _.uniq(blogs.map(blog => blog.author))
  const author_likes = authors.map(author => ({ 'author': author, 'likes': totalLikes(blogs.filter(blog => blog.author === author)) }))

  return blogs.length === 0
    ? 0
    : _.maxBy(author_likes, (obj) => obj.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
