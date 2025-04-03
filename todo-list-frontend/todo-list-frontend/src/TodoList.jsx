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
        document.body.style.backgroundColor = darkMode ? "#222" : "#eae0c8";
    }, [darkMode]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch("https://pit3-react-django.onrender.com/api/todos/fetch/");
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (task.trim() === "") return;
        const newTask = { title: task, completed: false };

        const response = await fetch("https://pit3-react-django.onrender.com/api/todos/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setTask("");
    };

    const removeTask = async (taskId) => {
        await fetch(`https://pit3-react-django.onrender.com/api/todos/${taskId}/delete/`, {
            method: "DELETE",
        });
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const toggleComplete = async (taskId) => {
        const task = tasks.find((task) => task.id === taskId);
        const updatedTask = { ...task, completed: !task.completed };

        const response = await fetch(`https://pit3-react-django.onrender.com/api/todos/${taskId}/update/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });
        const data = await response.json();
        setTasks(tasks.map((task) => (task.id === taskId ? data : task)));
    };

    const editTask = (index) => {
        setEditingIndex(index);
        setEditedTask(tasks[index].title);
    };

    const saveEditedTask = async (taskId) => {
        if (editedTask.trim() === "") return;
        const updatedTask = { title: editedTask, completed: false };

        const response = await fetch(`https://pit3-react-django.onrender.com/api/todos${taskId}/update/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });
        const data = await response.json();
        setTasks(tasks.map((task) => (task.id === taskId ? data : task)));
        setEditingIndex(null);
    };

    const clearCompleted = async () => {
        const completedTasks = tasks.filter((task) => task.completed);
        for (const task of completedTasks) {
            await removeTask(task.id);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <h2>To-Do List</h2>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
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
                {filteredTasks.map((t) => (
                    <li key={t.id} className={t.completed ? "completed" : ""}>
                        <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t.id)} />
                        {editingIndex === t.id ? (
                            <input type="text" value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
                        ) : (
                            <span onClick={() => toggleComplete(t.id)} style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                                {t.title}
                            </span>
                        )}
                        <div className="task-buttons">
                            <button onClick={() => removeTask(t.id)}>Delete</button>
                            {editingIndex === t.id ? (
                                <button onClick={() => saveEditedTask(t.id)}>💾</button>
                            ) : (
                                <button onClick={() => editTask(t.id)}>Edit</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
