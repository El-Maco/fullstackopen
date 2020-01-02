import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({ onClick, text }) => {
  return (
  <button onClick={onClick}>
  {text}
  </button>
  )
}


const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ( {good, neutral, bad} ) => {
  const all = good + neutral + bad
  const avg = (all ? (good - bad) / all : 0)
  const positive = (all ? 100 * good / all : 0)

  if ( all === 0 ) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={all} />
        <Statistic text="average" value={avg} />
        <Statistic text="positive" value={positive} />
      </tbody>
    </table>
  )
}


const App = () => {
  const [clicks, setClicks] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  })

  const handleClickGood = () => {
    const newClicks = {
      ...clicks,
      good: clicks.good + 1
    }
    setClicks(newClicks)
  }

  const handleClickNeutral = () => {
    const newClicks = {
      ...clicks,
      neutral: clicks.neutral + 1
    }
    setClicks(newClicks)
  }

  const handleClickBad = () => {
    const newClicks = {
      ...clicks,
      bad: clicks.bad + 1
    }
    setClicks(newClicks)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleClickGood} text="good" />
      <Button onClick={handleClickNeutral} text="neutral" />
      <Button onClick={handleClickBad} text="bad" />
      <Statistics good={clicks.good} neutral={clicks.neutral} bad={clicks.bad} />
    </div>
  )
  
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
