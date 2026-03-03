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

  function handleToggleTodos(idToToggle) {
    const updatedTodos = todos.map((item) => {
      if (item.id === idToToggle) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTodos(updatedTodos);
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
    const saved = localStorage.getItem("myTodos");
    if (saved && saved.length > 2) {
      setTodos(JSON.parse(saved));
      console.log("Loaded from localStorage");
    } else {
      const fetchData = async () => {
        try {
          const data = await getTodos();
          console.log("Loaded from API");

          setTodos(data.todos);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("myTodos", JSON.stringify(todos));
  }, [todos]);
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
            {todo.todo}{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleToggleTodos(todo.id)}
            >
              {todo.completed ? "✅" : "❌"}
            </span>
            <button onClick={() => handleDeleteTodos(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
