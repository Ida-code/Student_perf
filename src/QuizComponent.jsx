import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizComponent() {
  const { topicName } = useParams(); // To know which questions to fetch
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Format: [{question_id, is_correct}]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Fetch questions for the selected topic
  useEffect(() => {
    fetch(`http://localhost/Stud_Perf/getQuestions.php?topic=${topicName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
      });
  }, [topicName]);

  const handleAnswer = (selectedOption) => {
    if (quizCompleted || isSubmitting) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    // Save this answer's data
    setUserAnswers([
      ...userAnswers,
      {
        question_id: currentQ.id,
        is_correct: isCorrect,
        selected_answer: selectedOption,
        correct_answer: currentQ.correct_answer,
      },
    ]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const submitFinalResults = async () => {
    if (isSubmitting || quizCompleted) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate score
      const score = userAnswers.filter((ans) => ans.is_correct).length;
      const totalQuestions = questions.length;
      const percentage = (score / totalQuestions) * 100;

      const response = await fetch(
        "http://localhost/Stud_Perf/SubmitResult.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: userAnswers,
            topic: topicName,
            score: score,
            total: totalQuestions,
            percentage: percentage,
          }),
          credentials: "include",
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Quiz submitted successfully:", result);
        setQuizCompleted(true);

        // Show success message
        alert(
          `Quiz completed! Your score: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)`,
        );

        // Return to topic selection after a short delay
        setTimeout(() => {
          navigate("/topicselection");
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit quiz");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="quiz-container">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/topicselection")}>
          Return to Topics
        </button>
      </div>
    );
  }

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
            disabled={quizCompleted || isSubmitting}
            style={{
              opacity: quizCompleted || isSubmitting ? 0.6 : 1,
              cursor: quizCompleted || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {questions[currentIndex][opt]}
          </button>
        ))}
      </div>

      {currentIndex === questions.length - 1 &&
        userAnswers.length === questions.length && (
          <button
            onClick={submitFinalResults}
            disabled={isSubmitting || quizCompleted}
            style={{
              background: isSubmitting ? "gray" : "green",
              color: "white",
              cursor: isSubmitting || quizCompleted ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}

      {isSubmitting && !quizCompleted && <p>Submitting your answers...</p>}

      {quizCompleted && <p>Quiz completed! Redirecting...</p>}
    </div>
  );
}

export default QuizComponent;
