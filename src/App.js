import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    const theme = JSON.parse(localStorage.getItem("dark"));
    if (saved) setTasks(saved);
    if (theme) setDark(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("dark", JSON.stringify(dark));
  }, [tasks, dark]);

  const addTask = () => {
    if (!input.trim()) return;

    if (editIndex !== null) {
      const newTasks = [...tasks];
      newTasks[editIndex].text = input;
      setTasks(newTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: input, completed: false }]);
    }

    setInput("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const startEdit = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Drag & Drop
  const handleDrag = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData("index");
    const newTasks = [...tasks];
    const draggedItem = newTasks.splice(draggedIndex, 1)[0];
    newTasks.splice(index, 0, draggedItem);
    setTasks(newTasks);
  };

  return (
    <div className={dark ? "container dark" : "container"}>
      <div className="top-bar">
        <h1>To-Do App</h1>
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write something..."
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>
          {editIndex !== null ? "Edit" : "Add"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Done</button>
      </div>

      <ul>
        {filteredTasks.map((task, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => handleDrag(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className={task.completed ? "done" : ""}
          >
            <span onClick={() => toggleTask(index)}>
              {task.text}
            </span>

            <div className="actions">
              <button onClick={() => startEdit(index)}>✏️</button>
              <button onClick={() => deleteTask(index)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;