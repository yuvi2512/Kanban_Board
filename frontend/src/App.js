import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";

function App() {
  const [tasktitle, setTaskTitle] = useState("");
  const [taskdescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get("http://localhost:3001/fetch")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const taskDetails = {
      tasktitle: tasktitle,
      taskdescription: taskdescription
    };

    axios.post("http://localhost:3001/save", taskDetails)
      .then((response) => {
        console.log(response);
        setTaskTitle("");
        setTaskDescription("");
        fetchTasks(); // Refresh task list
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskTitle(task.tasktitle);
    setTaskDescription(task.taskdescription);
  };

  const handleUpdate = () => {
    if (!editingTask) return;

    const updatedTask = {
      tasktitle: tasktitle,
      taskdescription: taskdescription
    };

    axios.put(`http://localhost:3001/update/${editingTask._id}`, updatedTask)
      .then((response) => {
        console.log(response);
        setEditingTask(null);
        setTaskTitle("");
        setTaskDescription("");
        fetchTasks(); // Refresh task list
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:3001/delete/${taskId}`)
      .then((response) => {
        console.log(response);
        fetchTasks(); // Refresh task list
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="app">
      <header className="navbar">
        <h1>Kanban Board</h1>
      </header>
      <div className="container">
        <div className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={tasktitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={taskdescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          {editingTask ? (
            <div>
              <button className="update-button" onClick={handleUpdate}>Update</button>
              <button className="cancel-button" onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          ) : (
            <button className="add-button" onClick={handleSubmit}>Add Task</button>
          )}
        </div>
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Task Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.tasktitle}</td>
                <td>{task.taskdescription}</td>
                <td><button className="edit-button" onClick={() => handleEdit(task)}>Edit</button></td>
                <td><button className="delete-button" onClick={() => handleDelete(task._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
