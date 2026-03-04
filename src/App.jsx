import { useEffect, useState } from "react";
import { getTodos } from "./api/todosApi";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleDeleteTodos(idToRemove) {
    const newTodosList = todos.filter((item) => item.id !== idToRemove);
    setTodos(newTodosList);
    localStorage.setItem("myTodos", JSON.stringify(newTodosList));
  }

  function handleToggleTodos(idToToggle) {
    const updatedTodos = todos.map((item) => {
      if (item.id === idToToggle) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTodos(updatedTodos);
    localStorage.setItem("myTodos", JSON.stringify(updatedTodos));
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
    localStorage.setItem("myTodos", JSON.stringify([newTodo, ...todos]));
  };

  useEffect(() => {
    const saved = localStorage.getItem("myTodos");
    if (saved && saved.length > 2) {
      try {
        const parsedTodos = JSON.parse(saved);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        } else {
          throw new Error("Invalid data format in localStorage");
        }
      } catch (error) {
        setError("Error loading todos from localStorage");
        console.error(error);
      }
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const data = await getTodos();
          setTodos(data.todos);
        } catch (error) {
          setError("Error fetching todos");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      localStorage.setItem("myTodos", JSON.stringify(todos));
    }
  }, [todos, loading, error]);

  return (
    <div className="container mx-auto p-4">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <header className="flex justify-between items-center">
        <form onSubmit={handleAddTodos} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Please enter a todo"
            className="px-4 py-2 border rounded w-full sm:w-72"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-24"
          >
            Add
          </button>
        </form>
      </header>
      <h1 className="text-xl font-semibold mt-4">Todo List</h1>
      <ul className="mt-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className={`${todo.completed ? "line-through" : ""}`}>
              {todo.todo}
            </span>
            <div className="flex space-x-2">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleToggleTodos(todo.id)}
              >
                {todo.completed ? "✅" : "❌"}
              </span>
              <button
                onClick={() => handleDeleteTodos(todo.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
