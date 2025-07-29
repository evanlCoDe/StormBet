import { useState } from "react";

function MainHome({ user, onLogout }) {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("profile");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1747",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Left-side menu */}
      <div
        style={{
          width: menuCollapsed ? 60 : 220,
          background: "#12205a",
          color: "#fff",
          transition: "width 0.2s",
          display: "flex",
          flexDirection: "column",
          alignItems: menuCollapsed ? "center" : "flex-start",
          paddingTop: 24,
          paddingBottom: 24,
          minHeight: "100vh",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        }}
      >
        <button
          onClick={() => setMenuCollapsed((c) => !c)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            marginLeft: menuCollapsed ? 0 : 12,
            marginBottom: 24,
            cursor: "pointer",
            fontSize: 22,
            width: menuCollapsed ? 40 : "auto",
            alignSelf: menuCollapsed ? "center" : "flex-start",
          }}
          title={menuCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {menuCollapsed ? "☰" : "⮜"}
        </button>
        <div
          onClick={() => setSelectedMenu("profile")}
          style={{
            padding: menuCollapsed ? "16px 0" : "12px 24px",
            width: "100%",
            background: selectedMenu === "profile" ? "#1a2b6d" : "none",
            cursor: "pointer",
            textAlign: menuCollapsed ? "center" : "left",
            fontWeight: selectedMenu === "profile" ? "bold" : "normal",
          }}
        >
          <span role="img" aria-label="profile">👤</span>
          {!menuCollapsed && <span style={{ marginLeft: 12 }}>User Profile</span>}
        </div>
        <div
          onClick={() => setSelectedMenu("games")}
          style={{
            padding: menuCollapsed ? "16px 0" : "12px 24px",
            width: "100%",
            background: selectedMenu === "games" ? "#1a2b6d" : "none",
            cursor: "pointer",
            textAlign: menuCollapsed ? "center" : "left",
            fontWeight: selectedMenu === "games" ? "bold" : "normal",
          }}
        >
          <span role="img" aria-label="games">🎮</span>
          {!menuCollapsed && <span style={{ marginLeft: 12 }}>Games</span>}
        </div>
        <div
          onClick={() => setSelectedMenu("bonus")}
          style={{
            padding: menuCollapsed ? "16px 0" : "12px 24px",
            width: "100%",
            background: selectedMenu === "bonus" ? "#1a2b6d" : "none",
            cursor: "pointer",
            textAlign: menuCollapsed ? "center" : "left",
            fontWeight: selectedMenu === "bonus" ? "bold" : "normal",
          }}
        >
          <span role="img" aria-label="bonus">🎁</span>
          {!menuCollapsed && <span style={{ marginLeft: 12 }}>Bonus</span>}
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top header */}
        <div
          style={{
            height: 64,
            background: "#4ecbff", // light blue
            color: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="./files/stormbetlogo.png"
              alt="StormBet Logo"
              style={{ width: 190, height: 190, marginRight: 20 }}
            />
            
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 17 }}>
              {user.username}
              <span style={{ color: "#162a5c", marginLeft: 12, fontWeight: 600 }}>
                {typeof user.credit === "number" ? `Credits: ${user.credit}` : ""}
              </span>
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={onLogout}
              style={{ marginLeft: 18 }}
            >
              Logout
            </button>
          </div>
        </div>
        {/* Central content panel */}
        <div style={{ flex: 1, padding: 32, background: "#0a1747", color: "#fff" }}>
          {selectedMenu === "profile" && (
            <div>
              <h2>User Profile</h2>
              <div>Email: {user.email}</div>
              <div>Username: {user.username}</div>
              <div>Credits: {user.credit}</div>
            </div>
          )}
          {selectedMenu === "games" && (
            <div>
              <h2>Games</h2>
              <div>Game content goes here...</div>
            </div>
          )}
          {selectedMenu === "bonus" && (
            <div>
              <h2>Bonus</h2>
              <div>Bonus content goes here...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainHome;