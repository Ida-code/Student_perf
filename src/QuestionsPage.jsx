import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuestionsPage() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.user_id) {
      setError("User not logged in");
      return;
    }

    fetch(`http://localhost/Stud_Perf/getQuestions.php?topic=${topic}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch(() => setError("Failed to load questions"));
  }, [topic]);

  const handleAnswer = (option) => {
    const q = questions[index];

    const ans = {
      question_id: q.id,
      is_correct: option === q.correct_answer,
    };

    const updated = [...answers, ans];
    setAnswers(updated);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      submitQuiz(updated);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const payload = {
        user_id: user.user_id,
        topic: topic,
        answers: finalAnswers,
      };

      console.log("Sending:", payload);

      const res = await fetch("http://localhost/Stud_Perf/SubmitResult.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      alert(`Score: ${data.score}/${data.total}`);

      navigate("/topicselection");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (error) return <h2>{error}</h2>;
  if (questions.length === 0) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>{topic}</h2>

      <h3>{questions[index].question}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={() => handleAnswer(questions[index].optionA)}>
          A. {questions[index].optionA}
        </button>

        <button onClick={() => handleAnswer(questions[index].optionB)}>
          B. {questions[index].optionB}
        </button>

        <button onClick={() => handleAnswer(questions[index].optionC)}>
          C. {questions[index].optionC}
        </button>

        <button onClick={() => handleAnswer(questions[index].optionD)}>
          D. {questions[index].optionD}
        </button>
      </div>
    </div>
  );
}

export default QuestionsPage;
