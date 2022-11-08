import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'

function App() {
  const [title, setTitle] = useState('')
  const [todos, setTodos] = useState([])
  const [newTitle,setNewTitle]=useState('')
  const [selectedId,setSelectedId]=useState(0) // id=0 is not selected, json server minimum id is 1 so 0 is a safe value

  const handleChange = event => {
    setTitle(event.target.value)
  }

  const createTodo = async () => {
    await axios.post('http://localhost:3001/todos', { title })
    getTodos() // refresh
    setTitle('')
  }

  const handleSubmit = event => {
    event.preventDefault() // prevent reloading while submitting
    if (!title) return
    createTodo()
  }

  const getTodos = async () => {
    const { data } = await axios.get('http://localhost:3001/todos') // asynchronous
    setTodos(data)
  }

  useEffect(() => {
    getTodos()
  })

  const deleteItem=x=>async()=>{
    await axios.delete(`http://localhost:3001/todos/${x}`)
    getTodos() // refresh
  }

  const handleNewTitle=event=>{
    setNewTitle(event.target.value)
  }

  const patchItem=async()=>{
    await axios.patch(
      `http://localhost:3001/todos/${selectedId}`,
      {title:newTitle}  
    )
    getTodos()
    setNewTitle('')
    setSelectedId(0)
  }

  const handlePatch=event=>{
    event.preventDefault()
    if(!newTitle||!selectedId)return
    patchItem()
  }

  return (
    <div>
      <h1>to do list</h1>
      <form onSubmit={handleSubmit}>
        <input required value={title} onChange={handleChange} />
        <button type='submit'>Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={`todo-item-${todo.id}`}>
            <span onClick={()=>setSelectedId(todo.id)}>{todo.title}</span>
            <button onClick={deleteItem(todo.id)}>delete permanently</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handlePatch}>
        <input required value={newTitle} onChange={handleNewTitle} />
        {/* if  selectedId or newTitle is not set, this button will be disabled*/}
        <button type='submit' disabled={!selectedId||!newTitle}>
          Edit
        </button>
      </form>
    </div>
  );
}

export default App;
