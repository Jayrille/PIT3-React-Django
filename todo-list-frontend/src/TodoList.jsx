import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        if (darkMode) {
            document.body.style.backgroundColor = "#222";
        } else {
            document.body.style.backgroundColor = "#eae0c8";
        }
    }, [darkMode]);

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, { text: task, completed: false }]);
        setTask("");
    };

    const toggleComplete = (index) => {
        const newTasks = tasks.map((t, i) => 
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(newTasks);
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditedTask(tasks[index].text);
    };

    const confirmEdit = (index) => {
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, text: editedTask } : t
        );
        setTasks(updatedTasks);
        setEditingIndex(null);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    return(
        <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <h2>To-Do List</h2>
            <button 
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
            >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <div className="input-container">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            <div className="filter-buttons">
                <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
                <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
                <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
            </div>

            <ul>
                {filteredTasks.map((t, index) => (
                <li key={index} className={t.completed ? "completed" : ""}>
                    <input 
                        type="checkbox" 
                        checked={t.completed} 
                        onChange={() => toggleComplete(index)}
                    />
                    {editingIndex === index ? (
                        <input 
                            type="text" 
                            value={editedTask} 
                            onChange={(e) => setEditedTask(e.target.value)}
                        />
                    ) : (
                        <span 
                            onClick={() => toggleComplete(index)}
                            style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'black' : 'inherit' }}
                        >
                            {t.text}
                        </span>
                    )}
                    <div className="task-buttons">
                        <button onClick={() => removeTask(index)}>Delete</button>
                        {editingIndex === index ? (
                            <button onClick={() => confirmEdit(index)}>💾</button>
                        ) : (
                            <button onClick={() => startEditing(index)}>Edit</button>
                        )}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
}
