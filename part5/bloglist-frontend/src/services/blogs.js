import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const response = axios.get(baseUrl)
  return response.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async blogObject => {
  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject)
  console.log(response)
  return response.data
}

const del = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(blogObject)
  const response = await axios.delete(`${baseUrl}/${blogObject.id}`, config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, update, del }
