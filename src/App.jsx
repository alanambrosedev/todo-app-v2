import { useEffect, useState } from "react";
import { getTodos } from "./api/todosApi";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  function handleDeleteTodos(idToRemove) {
    const newTodosList = todos.filter((item) => {
      return item.id !== idToRemove;
    });
    setTodos(newTodosList);
  }
  const handleAddTodos = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      todo: inputValue,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTodos();

        setTodos(data.todos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <header>
        <form onSubmit={handleAddTodos}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Please enter a todo"
          />
          <button type="submit">Add</button>
        </form>
      </header>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.todo} {todo.completed ? "✅" : "❌"}
            <button onClick={() => handleDeleteTodos(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
