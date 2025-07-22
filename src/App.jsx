import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import TodoList from "./TodoList";
import TaskDetail from "./TaskDetail";

function App() {
  const [user, setUser] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  var randomOnlineCount = Math.floor(Math.random() * (10000 - 2500 + 1)) + 2500;

  useEffect(() => {
    // Update the online members counter every second
    const interval = setInterval(() => {
      setOnlineCount(randomOnlineCount);
      randomOnlineCount = Math.floor(Math.random() * 501)-250 + randomOnlineCount;
      // Simulate a change in online count
    }, 1000);
    // Set initial value immediately
    setOnlineCount(randomOnlineCount);
    return () => clearInterval(interval);
  }, []); 

  return (
    <Router basename="/otw_service">
      {}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 30,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#198754",
            boxShadow: "0 0 10px 2px #198754",
            animation: "flash 2s infinite"
          }}
        ></span>
        <span style={{ color: "#198754", fontWeight: "bold", fontSize: "1.1rem" }}>
          {onlineCount}
        </span>
        <style>
          {`
            @keyframes flash {
              0%, 100% { opacity: 1; box-shadow: 0 0 10px 2px #198754; }
              50% { opacity: 0.4; box-shadow: 0 0 2px 0px #198754; }
            }
          `}
        </style>
      </div>
      
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
      © {new Date().getFullYear()} OTW. All rights reserved.
      {"  "}
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSc6w2AhsBGIPPChMwmt2-S8ZKwt9YWnn29DcT4Ek2RL96aR4A/viewform?usp=dialog" target="_blank" style={{ color: "#888", textDecoration: "underline" }}>
        Report a problem
      </a>
    </footer>
    </Router>
  );
}

export default App;