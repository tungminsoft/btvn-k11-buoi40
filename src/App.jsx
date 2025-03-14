import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);
  const [task, setTask] = useState("");
  const inputRef = useRef(null);

  const isTaskValid = (task) => {
    if (task === "")
      return "Task không được để trống";

    if (tasks.some(item => item.task === task))
      return "Task đã tồn tại";

    if (task.length > 250)
      return "Task không được quá 250 ký tự";
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = (e) => {
    e.preventDefault();

    const newTask = task.trim();
    const error = isTaskValid(newTask);
    if (error)
      return alert(error);

    setTasks((prev) => {
      let newTasks = [{ id: Date.now(), task: newTask, completed: false },...prev];

      return newTasks
    })
    setTask("");
    inputRef.current.focus();
  }

  const handleEdit = (item) => {
    let oldTast = item.task;
    let task = prompt("Edit task", item.task).trim();
    if (task === oldTast)
      return;

    const error = isTaskValid(task);
    if (error)
      return alert(error);

    setTasks((prev) => {
      let newTasks = prev.map((i) => {
        if (i.id === item.id)
          i.task = task;
        return i;
      });
      return newTasks
    });
  }

  const handleMark = (item) => {
    setTasks((prev) => {
      let newTasks = prev.map((i) => {
        if (i.id === item.id) {
          i.completed = !i.completed;
        }
        return i;
      });

      return newTasks
    });
  }

  const handleDelete = (item) => {
    if (!confirm(`Bạn có muốn xóa task ${item.task} không?`))
      return;

    setTasks((prev) => {
      let newTasks = prev.filter((i) => i.id !== item.id);
      return newTasks
    });
  }
  return (
    <main>
      <h1 className="page-heading">Create your Todo-List</h1>

      <form action="" className="todo-form">
        <input
          type="text"
          id="todo-input"
          className="input"
          placeholder="What are your tasks for today?"
          spellcheck="false"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && handleAdd(e)}
        />
        <button id="submit" className="submit-btn" onClick={handleAdd}>
          Add
        </button>
      </form>

      <ul id="task-list" className="task-list">

        {tasks && tasks.map((item) => (
          <li key={item.id} className={`task-item ${item.completed ? "completed" : ""}`}>
            <span className="task-title">{item.task}</span>
            <div className="task-action">
              <button className="task-btn edit" onClick={() => handleEdit(item)}>Edit</button>
              <button className="task-btn done" onClick={() => handleMark(item)}>{item.completed ? "Mark as undone" : "Mark as done"}</button>
              <button className="task-btn delete" onClick={() => handleDelete(item)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
