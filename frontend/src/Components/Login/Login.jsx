import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:6969/authUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const result = await response.json();

      if (result.message) {
        // Extract UUID from "message"
        localStorage.setItem("userUUID", result.message); // Store UUID
        alert("Login successful!");
        navigate("/home"); // Redirect to home page
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Check console for details.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={data.username}
        onChange={(e) => updateField("username", e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => updateField("password", e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}
