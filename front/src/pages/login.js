import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value}));
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.valid) {
          navigate("/");
          toast.success("Login Successful");
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/login", values)
      .then((res) => {
        if (res.data.Login) {
          navigate("/");
        } else {
          toast.error("No record!");
        }
      })
      .catch((err) => console.log(err));
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
            />
          </div>{" "}
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
