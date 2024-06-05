import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/userContext";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(UserContext);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/login", values);
      const { Login, role, username } = res.data;
      if (Login) {
        setUser({ username: res.data.username, role });

        if (role === "logistic manager") {
          navigate("/");
          toast.success(`Welcome ${username}`);
        } else if (role === "delivery personnel") {
          navigate("/");
          toast.success(`Welcome ${username}`);
        }
        setIsAuthenticated(true);
      } else {
        toast.error("Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed!");
    }
  };

  axios.defaults.withCredentials = true;

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              name="email"
              onChange={handleInput}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleInput}
              className="form-control rounded-0"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
          <br />
          <Link
            to="/register"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
