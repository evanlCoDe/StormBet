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
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // null, "valid", "invalid", "checking"

  useEffect(() => {
    setShowSignUp(params.get("showsignup") === "true");
  }, [location.search]);

  // Check promo code validity as user types
  useEffect(() => {
    let ignore = false;
    const checkPromo = async () => {
      if (!promoCode.trim()) {
        setPromoStatus(null);
        return;
      }
      setPromoStatus("checking");
      const promoQuery = query(
        collection(db, "promocode"),
        where("code", "==", promoCode.trim())
      );
      const promoSnap = await getDocs(promoQuery);
      if (ignore) return;
      setPromoStatus(promoSnap.empty ? "invalid" : "valid");
    };
    checkPromo();
    return () => { ignore = true; };
  }, [promoCode]);

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
      alert("Incorrect username or password");
    }
  };

  const handleSignUp = async () => {
    if (!newUsername.trim() || !newPassword || !confirmPassword || !newEmail.trim()) {
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

    let credit = 0;
    let usedPromoCode = null;

    // Promo code logic (multi-use, but only once per user)
    if (promoCode.trim()) {
      const promoQuery = query(
        collection(db, "promocode"),
        where("code", "==", promoCode.trim())
      );
      const promoSnap = await getDocs(promoQuery);
      if (promoSnap.empty) {
        alert("Promo code not found or invalid.");
        return;
      }
      const promoDoc = promoSnap.docs[0];
      const promoData = promoDoc.data();

      // Check if this user (by email or username) has already used this code
      const userWithPromoQuery = query(
        collection(db, "users"),
        where("usedPromoCodes", "array-contains", promoCode.trim()),
        where("username", "==", newUsername)
      );
      const userWithPromoSnap = await getDocs(userWithPromoQuery);
      if (!userWithPromoSnap.empty) {
        alert("You have already used this promo code.");
        return;
      }

      credit = promoData.value || 0;
      usedPromoCode = promoCode.trim();
    }

    // Add new user with promo code and credit, and record usedPromoCodes as array
    await addDoc(collection(db, "users"), {
      email: newEmail,
      username: newUsername,
      password: newPassword,
      credit: credit,
      usedPromoCodes: usedPromoCode ? [usedPromoCode] : [],
    });

    alert(
      credit > 0
        ? `Register successful! You received $ ${credit} from your promo code. Please log in.`
        : "Register successful! Please log in."
    );
    setShowSignUp(false);
    setNewEmail("");
    setNewUsername("");
    setNewPassword("");
    setConfirmPassword("");
    setPromoCode("");
    setPromoStatus(null);
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
        <h2 className="mb-4 text-center">{showSignUp ? "Register" : "Login"}</h2>
        {!showSignUp ? (
          <>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Username"
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
                placeholder="New Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
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
            <div className="mb-3" style={{ position: "relative" }}>
              <input
                className="form-control"
                placeholder="🎁 Promo Code (optional)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ paddingRight: "2.5rem" }}
              />
              {promoStatus === "valid" && (
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "green",
                    fontSize: "1.3rem",
                    pointerEvents: "none"
                  }}
                  title="Promo code valid"
                >
                  ✅
                </span>
              )}
              {promoStatus === "invalid" && (
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "red",
                    fontSize: "1.3rem",
                    pointerEvents: "none"
                  }}
                  title="Promo code invalid"
                >
                  ❌
                </span>
              )}
              {promoStatus === "checking" && (
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                    fontSize: "1.1rem",
                    pointerEvents: "none"
                  }}
                  title="Checking promo code"
                >
                  ...
                </span>
              )}
            </div>
            <button className="btn btn-success w-100 mb-2" onClick={handleSignUp}>
              Create Account
            </button>
            <div className="d-flex align-items-center my-2">
              <div style={{ flex: 1, height: 1, background: "#ccc" }} />
              <span style={{ color: "#888", margin: "0 10px", fontSize: "0.98rem" }}>
                Already have an account?
              </span>
              <div style={{ flex: 1, height: 1, background: "#ccc" }} />
            </div>
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