import React, { useState } from "react";
import { useEffect } from "react";
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
      setError("User not logged in.Please Login again.");
      return;
    }

    fetch(`http://localhost:8081/getQuestions.php?topic=${topic}`)
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

      const res = await fetch("http://localhost:8081/SubmitResult.php", {
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

  if (error)
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>{error}</h2>;
  if (questions.length === 0)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0066ff, #00cc99)",
        margin: 0,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 102, 255, 0.2)",
          width: "500px",
          maxWidth: "90%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              flex: 1,
              marginTop: 0,
              marginBottom: 0,
              color: "#0066ff",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            {topic}
          </h2>
          <span
            style={{
              backgroundColor: "#0066ff",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {index + 1} / {questions.length}
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
            marginBottom: "25px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((index + 1) / questions.length) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #0066ff, #00cc99)",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "2px solid #f0f0f0",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              margin: 0,
              color: "#333",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            {questions[index].question}
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => handleAnswer(questions[index].optionA)}
            style={{
              padding: "12px 15px",
              backgroundColor: "#0066ff",
              border: "2px solid transparent",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              color: "white",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00a86b";
              e.currentTarget.style.borderColor = "#0066ff";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066ff";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontWeight: "bold", minWidth: "25px" }}>A.</span>
            <span style={{ flex: 1 }}>{questions[index].optionA}</span>
          </button>

          <button
            onClick={() => handleAnswer(questions[index].optionB)}
            style={{
              padding: "12px 15px",
              backgroundColor: "#0066ff",
              border: "2px solid transparent",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              color: "white",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00a86b";
              e.currentTarget.style.borderColor = "#0066ff";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066ff";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontWeight: "bold", minWidth: "25px" }}>B.</span>
            <span style={{ flex: 1 }}>{questions[index].optionB}</span>
          </button>

          <button
            onClick={() => handleAnswer(questions[index].optionC)}
            style={{
              padding: "12px 15px",
              backgroundColor: "#0066ff",
              border: "2px solid transparent",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              color: "white",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00a86b";
              e.currentTarget.style.borderColor = "#0066ff";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066ff";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontWeight: "bold", minWidth: "25px" }}>C.</span>
            <span style={{ flex: 1 }}>{questions[index].optionC}</span>
          </button>

          <button
            onClick={() => handleAnswer(questions[index].optionD)}
            style={{
              padding: "12px 15px",
              backgroundColor: "#0066ff",
              border: "2px solid transparent",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              color: "white",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00a86b";
              e.currentTarget.style.borderColor = "#0066ff";
              e.currentTarget.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066ff";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontWeight: "bold", minWidth: "25px" }}>D.</span>
            <span style={{ flex: 1 }}>{questions[index].optionD}</span>
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}
        >
          Question {index + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;
