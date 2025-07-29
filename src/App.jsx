import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import MainHome from "./MainHome";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router basename="/otw_service">
      {user ? (
        <MainHome user={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={(userObj) => setUser(userObj)} />
      )}
      <footer
        style={{
          position: "fixed",
          bottom: 10,
          left: 0,
          width: "100vw",
          textAlign: "center",
          color: "#888",
          fontSize: "0.95rem",
        }}
      >
        © {new Date().getFullYear()} StormBet. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;