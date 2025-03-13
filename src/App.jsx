import { useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : []);

  const inputRef = useRef(null);


  const isTaskValid = (task) => {
    if (task === "")
      return "0|Task không được để trống";

    if (tasks.some(item => item.task === task))
      return "0|Task đã tồn tại";

    if (task.length > 250)
      return "0|Task không được quá 250 ký tự";

    return "1|";
  }
  const handleAdd = (e) => {
    e.preventDefault();

    let task = inputRef.current.value.trim();
    let checkValid = isTaskValid(task);
    if (checkValid.startsWith("0|")) {
      alert(checkValid.split("|")[1]);
      return;
    }

    setTasks((prev)=>{
      let newTasks = [...prev, { id: Date.now(), task, completed: false }];

      localStorage.setItem("tasks", JSON.stringify(newTasks));

      return newTasks
    })
    inputRef.current.value = "";
    inputRef.current.focus();
  }

  const handleEdit = (item) => {
    let task = prompt("Edit task", item.task).trim();

    let checkValid = isTaskValid(task);
    if (checkValid.startsWith("0|")) {
      alert(checkValid.split("|")[1]);
      return;
    }

    setTasks((prev) => {
      let newTasks =prev.map((i) => {
        if (i.id === item.id)
          i.task = task;
        return i;
      });

      localStorage.setItem("tasks", JSON.stringify(newTasks));
      
      return newTasks
    });
  }

  const handleMark = (item) => {
    console.log(item);
    setTasks((prev) => {
      let newTasks =prev.map((i) => {
        if (i.id === item.id) {
          i.completed = !i.completed;
        }
        return i;
      });

      localStorage.setItem("tasks", JSON.stringify(newTasks));
      
      return newTasks
    });
  }

  const handleDelete = (item) => {
    if (!confirm(`Bạn có muốn xóa task ${item.task} không?`))
      return;

    setTasks((prev) => {
      let newTasks =prev.filter((i) => i.id !== item.id);

      localStorage.setItem("tasks", JSON.stringify(newTasks));
      
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
          onKeyDown={(e) => e.key === "Enter" && handleAdd(e)}
          ref={inputRef}
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
