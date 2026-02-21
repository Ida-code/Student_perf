import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizComponent() {
  const { topicName } = useParams(); // To know which questions to fetch
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Format: [{question_id, is_correct}]
  const navigate = useNavigate();

  // 1. Fetch questions for the selected topic
  useEffect(() => {
    fetch(`http://localhost/getQuestions.php?topic=${topicName}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, [topicName]);

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    // Save this answer's data
    setUserAnswers([
      ...userAnswers,
      {
        question_id: currentQ.id,
        is_correct: isCorrect,
      },
    ]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const submitFinalResults = async () => {
    const response = await fetch("http://localhost/SubmitResult.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: userAnswers }),
      credentials: "include",
    });

    if (response.ok) {
      // Return to topic selection as per your requirement
      navigate("/topicselection");
    }
  };

  if (questions.length === 0) return <p>Loading Questions...</p>;

  return (
    <div className="quiz-container">
      <h3>{topicName} Quiz</h3>
      <p>
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="question-card">
        <h4>{questions[currentIndex].question}</h4>
        {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(questions[currentIndex][opt])}
          >
            {questions[currentIndex][opt]}
          </button>
        ))}
      </div>

      {currentIndex === questions.length - 1 &&
        userAnswers.length === questions.length && (
          <button
            onClick={submitFinalResults}
            style={{ background: "green", color: "white" }}
          >
            Submit Quiz
          </button>
        )}
    </div>
  );
}

export default QuizComponent;
