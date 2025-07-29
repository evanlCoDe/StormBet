import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import TodoList from "./TodoList";
import TaskDetail from "./TaskDetail";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router basename="/otw_service">
      {}
      {user ? (
        <>
          <div className="d-flex justify-content-end align-items-center p-3" style={{ gap: "10px" }}>
            <span style={{ color: "#888", fontSize: "1rem" }}>
              Log in as <span style={{ fontWeight: "bold" }}>{user.username}</span>
              {user.SuperAccount ? (
                <span style={{ fontWeight: "normal" }}> (admin)*</span>
              ) : (
                <span style={{ fontWeight: "normal" }}> (user)*</span>
              )}
            </span>
            <button className="btn btn-outline-danger" onClick={() => setUser(null)}>
              Logout
            </button>
          </div>
          <Routes>
            <Route path="/" element={<TodoList user={user}/>} />
            <Route path="/task/:id" element={<TaskDetail user={user}/>} />
          </Routes>
        </>
      ) : (
        <Login onLogin={(userObj) => setUser(userObj)} />
      )}
      {/* Copyright footer */}
    <footer
      style={{
        position: "fixed",
        bottom: 10,
        left: 0,
        width: "100vw",
        textAlign: "center",
        color: "#888",
        fontSize: "0.95rem",
        // zIndex: 9999,
        // pointerEvents: "none"
      }}
    >
      © {new Date().getFullYear()} StormBet. All rights reserved.
    </footer>
    </Router>
  );
}

export default App;