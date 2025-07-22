import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TodoList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("alphabetical");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const addTask = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "tasks"), {
        text,
        address: "",
        mapLink: "",
        description: "",
        images: [],
        votes: 0,
        creator: user.username,
      });
      setText("");
    }
  };

  const removeTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  // Sorting logic
  const getSortedTasks = () => {
    let filtered = tasks.filter(task =>
      task.text.toLowerCase().includes(search.toLowerCase())
    );
    if (sortType === "alphabetical") {
      filtered = filtered.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortType === "votes") {
      filtered = filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (sortType === "admin") {
      filtered = filtered.sort((a, b) => {
        // SuperAccount/admins first, then users
        const aIsAdmin = a.creator && a.creator.toLowerCase().includes("admin");
        const bIsAdmin = b.creator && b.creator.toLowerCase().includes("admin");
        if (aIsAdmin === bIsAdmin) return 0;
        return aIsAdmin ? -1 : 1;
      });
    }
    return filtered;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "white", marginBottom: 0 }}>Meets</h2>
        {/* Sort dropdown on the right */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <label htmlFor="sortSelect" className="form-label mb-0" style={{ color: "#fff" }}>Sort by:</label>
          <select
            id="sortSelect"
            className="form-select"
            style={{ maxWidth: 220 }}
            value={sortType}
            onChange={e => setSortType(e.target.value)}
          >
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="votes">Highest Votes</option>
            <option value="admin">Admin to User</option>
          </select>
        </div>
      </div>
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter new meets"
        />
        <button className="btn btn-primary" onClick={addTask}>
          New
        </button>
      </div>
      {/* Search bar below "Enter new meets" */}
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search meets"
        />
      </div>
      <ul className="list-group">
        {getSortedTasks().map((task) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={task.id}>
            <span
              onClick={() => navigate(`/task/${task.id}`)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {task.text}
            </span>
            {task && (task.creator === user.username || user.SuperAccount) && (
              <button className="btn btn-danger btn-sm" onClick={() => removeTask(task.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;