import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import headphones from "../assets/headphones.jpg";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("username")) {
      window.alert("You are already logged in!");
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const response = await fetch("http://localhost:5001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      setLoginError(null);
      localStorage.setItem("username", username);
      navigate("/");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-container">
        {/* <div className="image-container">
          <img src={headphones} alt="headphones" style={{ width: '70%', height: 'auto', marginLeft: '10%' }} />
        </div> */}
        <div className="form-container">
          <h1 style={{ marginBottom: "140px" }}>Log In</h1>

          {loginError && <div className="error">{loginError}</div>}

          <form onSubmit={onSubmit}>
            <div>
              <label style={{ fontSize: "24px" }}>Username:</label>
              <input
                style={{
                  width: "200px",
                  height: "30px",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "black",
                }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: "24px" }}>Password:</label>
              <input
                style={{
                  width: "200px",
                  height: "30px",
                  fontSize: "16px",
                  backgroundColor: "white",
                  color: "black",
                }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input type="submit" value="Log In" />
            </div>
          </form>
          <div style={{ marginTop: "20px" }}>
            <p>
              Don't have an account? <Link to="/register">Register here!</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
