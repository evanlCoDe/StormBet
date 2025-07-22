// TaskDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

function TaskDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const load = async () => {
      const docRef = doc(db, "tasks", id);
      const snap = await getDoc(docRef);
      setTask({ id: snap.id, ...snap.data() });
    };
    load();
  }, [id]);

  const handleChange = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    const { id, ...data } = task;
    await updateDoc(doc(db, "tasks", id), data);
    alert("Saved successfully");
  };


  const hasVoted = task && Array.isArray(task.voters) && task.voters.includes(user.username);
  const vote = async () => {
    if (hasVoted) {
      alert("You Voted！");
      return;
    }
    const updated = { ...task, votes: task.votes + 1, voters: [...(task.voters || []), user.username] };
    setTask(updated);
    await updateDoc(doc(db, "tasks", id), {
      votes: updated.votes,
      voters: arrayUnion(user.username)
    });
  };

  const extractSrcFromIframe = (html) => {
    const match = html?.match(/src=["']([^"']+)["']/);
    return match ? match[1] : null;
  };


  if (!task) return <p>Loading...</p>;

  const editable = task.creator === user.username;

  return (
    <div className="container py-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/")}
      >
        Todo List
      </button>
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 600 }}>
        <h2 className="mb-3 text-center">Task details</h2>
        <p><strong>Creator：</strong>{task.creator}</p>
        <button
          className="btn btn-outline-primary mb-3"
          onClick={vote}
          disabled={hasVoted}
        >
          👍 Vote <span className="badge bg-primary ms-2">{task.votes}</span>
          {hasVoted && <span className="ms-2 text-success">Voted</span>}
        </button>

        {editable ? (
          <>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={task.text}
                onChange={(e) => handleChange("text", e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={task.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Address"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Google Maps Embed Link</label>
              <input
                type="text"
                className="form-control"
                value={task.mapLink}
                onChange={(e) => handleChange("mapLink", e.target.value)}
                placeholder="Google Map Embed Link"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={task.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description"
                rows={3}
              />
            </div>
            {/* ...other input fields... */}
            <div className="mb-3">
              <label className="form-label">Image links</label>
              {task.images.map((url, idx) => (
                <div className="input-group mb-2" key={idx}>
                  <input
                    type="text"
                    className="form-control"
                    value={url}
                    onChange={e => {
                      const newImages = [...task.images];
                      newImages[idx] = e.target.value;
                      handleChange("images", newImages);
                    }}
                    placeholder={`Image link #${idx + 1}`}
                  />
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={() => {
                      const newImages = task.images.filter((_, i) => i !== idx);
                      handleChange("images", newImages);
                    }}
                    tabIndex={-1}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              ))}
              <button
                className="btn btn-outline-primary w-100"
                type="button"
                onClick={() => handleChange("images", [...task.images, ""])}
              >
                <i className="bi bi-plus"></i> Add Link
              </button>
            </div>
            {/* ...rest of editable fields... */}
            <button className="btn btn-success w-100" onClick={save}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Task name：</strong>{task.text}</p>
            <p><strong>Address：</strong>{task.address}</p>
            {
              <p>
                <strong>Map：</strong>
                {task.mapLink && (
                  <div className="my-2">
                    <iframe
                      src={extractSrcFromIframe(task.mapLink) || task.mapLink}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Map"
                    ></iframe>
                    
                  </div>
                )}
              </p>


            }
            <p><strong>Description：</strong>{task.description}</p>
          </>
        )}

        <div className="mt-4">
          <strong>Picture preview：</strong>
          <div className="d-flex gap-2 flex-wrap mt-2">
            {task.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`img-${index}`}
                className="rounded border"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            ))}
          </div>
          {
              <p>
                <strong>Map：</strong>
                {task.mapLink && (
                  <div className="my-2">
                    <iframe
                      src={extractSrcFromIframe(task.mapLink) || task.mapLink}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Map"
                    ></iframe>
                    
                  </div>
                )}
              </p>


            }
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;