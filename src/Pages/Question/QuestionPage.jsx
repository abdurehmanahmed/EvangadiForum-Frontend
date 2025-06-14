import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Components/Auth/Auth";
import { axiosInstance } from "../../Utility/axios";
import styles from "./Question.module.css";
import { Link } from "react-router-dom";

function QuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title.trim() || !description.trim()) {
      setError("Both title and description are required.");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/api/question", {
        title,
        description,
        tag,
      });

      setSuccess("Question posted successfully!");
      setTitle("");
      setDescription("");
      setTag("");
      setLoading(false);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to post question. Please try again."
      );
      setLoading(false);
    }
  };    

  return (
    <div className={styles.questionContainer}>


      {/* Success Message */}
      {success && (
        <div className={styles.successBox}>
          <p>{success}</p>
          <div className={styles.navigationOptions}>
            <Link to="/home" className={styles.navButton}>
              🏠 Home
            </Link>
            <Link to="/home" className={styles.navButton}>
              📚 All Questions
            </Link>
          </div>
        </div>
      )}

      <h1 className={styles.title}>Ask a Question</h1>
      <form onSubmit={handleSubmit} className={styles.postQuestionForm}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.questionTitleInput}
          required
        />
        <textarea
          placeholder="Question Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.questionDetailsTextarea}
          required
        />
        <input
          type="text"
          placeholder="Tag (optional)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={styles.tagInput}
        />

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Post Your Question"}
        </button>
      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
}

export default QuestionPage;
