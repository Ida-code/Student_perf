import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost/Stud_Perf/registerstud.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          role: role,
        }),
      },
    );

    const text = await response.text();
    console.log("SERVER RESPONSE:", text);

    if (text.includes("success")) {
      alert("Registration successful!");
      navigate("/"); // go to login
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="competitive">Competitive</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <div className="link" onClick={() => navigate("/")}>
        Already have an account? Login
      </div>
    </div>
  );
}

export default Register;
