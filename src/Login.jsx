import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
// Ensure 'React' is explicitly imported
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/Loginstud.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          // Don't send role - it will come from database
        }),
      });

      const text = await response.text();
      console.log("RAW LOGIN RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        alert("Invalid server response: " + text);
        return;
      }

      if (data.success === true) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: data.user.id,
            name: data.user.name,
            role: data.user.role,
          }),
        );

        navigate("/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Cannot connect to server. Please check if XAMPP is running.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",

        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "350px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "20px" }}>
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
          />

          <br />
          <br />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>

        <br />

        <p style={{ textAlign: "center", marginBottom: 0 }}>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
