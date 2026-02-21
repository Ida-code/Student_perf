import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuestionsPage() {
  const { topic } = useParams(); // Matches the :topic in your App.js
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // Stores {question_id, is_correct}

  useEffect(() => {
    // Fetch questions specifically for this topic
    fetch(`http://localhost/getQuestions.php?topic=${topic}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, [topic]);

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentIdx].correct_answer;

    // Save answer state locally
    const newAnswer = {
      question_id: questions[currentIdx].id,
      is_correct: isCorrect,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    const response = await fetch("http://localhost/SubmitResult.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: finalAnswers }),
      credentials: "include",
    });

    if (response.ok) {
      // Per your requirement: Take them back to Topic Selection
      navigate("/topicselection");
    }
  };

  if (questions.length === 0)
    return <div>Loading questions for {topic}...</div>;

  return (
    <div className="quiz-page-container">
      {/* Progress bar at the top */}
      <div className="progress-status">
        <p>
          {topic} Quiz: Question {currentIdx + 1} of {questions.length}
        </p>
        <div className="bar-bg">
          <div
            className="bar-fill"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="question-card">
        <h3 className="question-text">{questions[currentIdx].question}</h3>
        <div className="options-grid">
          {["optionA", "optionB", "optionC", "optionD"].map((key) => (
            <button
              key={key}
              className="option-button"
              onClick={() => handleAnswer(questions[currentIdx][key])}
            >
              <span className="option-label">{key.slice(-1)}</span>
              {questions[currentIdx][key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;
