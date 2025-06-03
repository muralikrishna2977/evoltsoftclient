import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signin", { email, password });
      
      if (response.data.message === "Login successful") {
        const userData = {
          user_id: response.data.userid,
          name: response.data.name,
          email: response.data.email,
        };
        navigate("/mainpage", { state: { user: userData } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form className="signinform" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="emailid"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button className="submit" type="submit">Sign In</button>
      </form>
      <div className="signnuppage">
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
      <div className="signinmessage">
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;
