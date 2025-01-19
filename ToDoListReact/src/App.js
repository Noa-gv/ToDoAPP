import React, { useEffect, useState } from "react";
import service from "./service";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // פונקציה להורדת משימות
  async function getTodos() {
    setLoadingTasks(true);
    try {
      const todos = await service.getTasks();
      setTodos(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoadingTasks(false);
    }
  }

  // פונקציה להורדת משתמשים
  async function getUsers() {
    setLoadingUsers(true);
    try {
      const users = await service.getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }

  // פונקציה להוספת משימה חדשה
  async function createTodo(e) {
    e.preventDefault();
    try {
      await service.addTask(newTodo);
      setNewTodo("");
      await getTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  // פונקציה לעדכון סטטוס המשימה
  async function updateCompleted(todo, isComplete) {
    try {
      await service.setCompleted(todo.id, isComplete);
      await getTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  // פונקציה למחיקת משימה
  async function deleteTodo(id) {
    try {
      await service.deleteTask(id);
      await getTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  // טעינת משימות ומשתמשים בעת טעינת הקומפוננטה
  useEffect(() => {
    getTodos();
    getUsers();
  }, []);

  return (
    <div className="dashboard">
      {/* רשימת משימות */}
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={createTodo}>
            <input
              className="new-todo"
              placeholder="Well, let's take on the day"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>
        </header>
        <section className="main" style={{ display: "block" }}>
          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li
                  className={todo.isComplete ? "completed" : ""}
                  key={todo.id}
                >
                  <div className="view">
                    <input
                      className="toggle"
                      type="checkbox"
                      defaultChecked={todo.isComplete}
                      onChange={(e) =>
                        updateCompleted(todo, e.target.checked)
                      }
                    />
                    <label>{todo.name}</label>
                    <button
                      className="destroy"
                      onClick={() => deleteTodo(todo.id)}
                    ></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      {/* רשימת משתמשים */}
      <section className="user-list">
        <header className="header">
          <h2>Users</h2>
        </header>
        <section className="main" style={{ display: "block" }}>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
}

export default App;
