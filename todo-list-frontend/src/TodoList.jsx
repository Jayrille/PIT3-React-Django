import { useState, useEffect } from "react";
import axios from 'axios'; 

const API_URL = "https://pit3-react-django.onrender.com/api/todos/";

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
        // Fetch tasks from the Django API
        axios.get(`${API_URL}fetch`)  // Make sure this matches your Django URL
            .then(response => {
                console.log(response.data);  // Log the fetched tasks
                setTasks(response.data);  // Assuming response contains the tasks
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });

        // Handle dark mode change
        localStorage.setItem("darkMode", darkMode);
        if (darkMode) {
            document.body.style.backgroundColor = "#222";
        } else {
            document.body.style.backgroundColor = "#eae0c8";
        }
    }, [darkMode]);

    const removeTask = (index) => {
        const taskToRemove = tasks[index];
        axios.delete(`${API_URL}${taskToRemove.id}/delete`)
            .then(() => {
                setTasks(tasks.filter((_, i) => i !== index));
            })
            .catch(error => {
                console.error("Error deleting task:", error);
            });
    };

    const addTask = () => {
        if (task.trim() === "") return;
        axios.post(`${API_URL}create`, { text: task, completed: false })
            .then(response => {
                setTasks([...tasks, response.data]);  // Assuming the API responds with the newly created task
                setTask("");
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });
    };

    const toggleComplete = (index) => {
        const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
        axios.put(`${API_URL}${tasks[index].id}/update`, updatedTask)
            .then(response => {
                const updatedTasks = tasks.map((task, i) =>
                    i === index ? response.data : task
                );
                setTasks(updatedTasks);
            })
            .catch(error => {
                console.error("Error updating task:", error);
            });
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditedTask(tasks[index].text);
    };

    const confirmEdit = (index) => {
        const updatedTask = { ...tasks[index], text: editedTask };
        axios.put(`${API_URL}${tasks[index].id}/update`, updatedTask)
            .then(response => {
                const updatedTasks = tasks.map((task, i) =>
                    i === index ? response.data : task
                );
                setTasks(updatedTasks);
                setEditingIndex(null);
            })
            .catch(error => {
                console.error("Error updating task:", error);
            });
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    return (
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
                                {t.text ? t.text : "No Title"}  {/* Fallback text if `text` is empty */}
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
    );
}
