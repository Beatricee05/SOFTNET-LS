import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", "Ally Maftah");
      localStorage.setItem("userRole", "Administrator");
      localStorage.setItem("userEmail", email);

      onLogin();
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#f5f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#fff",
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#2A0F74",
          }}
        >
          SoftNet Licensing System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Sign in to continue
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: "#2A0F74",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            marginTop: "15px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  marginBottom: "15px",
};
