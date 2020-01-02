import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({ onClick, text }) => {
  return (
  <button onClick={onClick}>
  {text}
  </button>
  )
}

const Max = ({array, anecdotes}) => {
  const copy = [ ...array ]
  const max_votes = Math.max(...copy)
  const max_index = copy.indexOf(max_votes)
  console.log("Max votes: ",max_votes)
  console.log("Index: ",max_index)
  return (
    <div>
      {anecdotes[max_index]}
      <br></br>
      has {max_votes} votes
    </div>
  )
}


const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleButton = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    setSelected(index) 
  }

  const handleVote = () => {
    const copy = [ ...votes ]
    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <br></br>
      has {votes[selected]} votes
      <br></br>
      <Button onClick={handleVote} text="vote" />
      <Button onClick={handleButton} text="next anecdote" />

      <h1>Anecdote with most votes</h1>
      <Max array={votes} anecdotes={props.anecdotes}/>
    </div>
  )
  
}

  const anecdotes = [
      'If it hurts, do it more often',
      'Adding manpower to a late software project makes it later!',
      'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      'Premature optimization is the root of all evil.',
      'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

ReactDOM.render(<App anecdotes={anecdotes} />,
  document.getElementById('root')
)
