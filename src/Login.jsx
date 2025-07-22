
import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


function Login({ onLogin }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    setShowSignUp(params.get("showsignup") === "true");
  }, [location.search]);

  const handleLogin = async () => {
    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      onLogin(snapshot.docs[0].data());
    } else {
      alert("Incorrect account id or password");
    }
  };

  const handleSignUp = async () => {
    if (!newUsername.trim() || !newPassword || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Check if username exists
    const q = query(
      collection(db, "users"),
      where("username", "==", newUsername)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Username already exists.");
      return;
    }
    // Add new user
    await addDoc(collection(db, "users"), {
      username: newUsername,
      password: newPassword
    });
    alert("Sign up successful! Please log in.");
    setShowSignUp(false);
    setNewUsername("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="card p-4 shadow" style={{ minWidth: "350px", zIndex: 1 }}>
        <h2 className="mb-4 text-center">{showSignUp ? "Sign Up" : "Login"}</h2>
        {!showSignUp ? (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Account ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100 mb-2" onClick={handleLogin}>
              Login
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-success w-100 mb-2" onClick={handleSignUp}>
              Create Account
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowSignUp(false)}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;