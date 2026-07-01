import { useEffect, useState } from "react";

const STORAGE_KEY = "todo-list-tasks";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, { id: Date.now(), text: task.trim(), completed: false }]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const startEditing = (t) => {
    setEditingId(t.id);
    setEditingText(t.text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === "") return;

    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editingText.trim() } : t)));
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <button onClick={addTask}>Add</button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {tasks.map((item) => (
            <li key={item.id} className={item.completed ? "completed" : ""}>
              {editingId === item.id ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editingText}
                  autoFocus
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(item.id)}
                />
              ) : (
                <span className="task-text" onClick={() => toggleTask(item.id)}>
                  {item.text}
                </span>
              )}

              <div className="task-actions">
                {editingId === item.id ? (
                  <button onClick={() => saveEdit(item.id)}>Save</button>
                ) : (
                  <button onClick={() => startEditing(item)}>Edit</button>
                )}
                <button onClick={() => deleteTask(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
