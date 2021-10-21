import React from 'react'

const Total = ({ parts }) => {  
  const sum = parts.reduce((sum, part) => sum = sum + part.exercises, 0)
  return (
    <p><b>total of {sum} exercises</b></p>
  )
}

export default Total
