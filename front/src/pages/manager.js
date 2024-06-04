import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Manager() {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);

  const handleInput = (e) => {
    setOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/order", order)
      .then((res) => {
        toast.success("Order posted");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
    <h1 className="text-center mb-4">Manager Dashboard</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="nameInput" className="form-label">Your name:</label>
        <input
          type="text"
          className="form-control"
          id="nameInput"
          name="name"
          onChange={handleInput}
        />
      </div>
      <div className="mb-3">
        <h3>Available Delivery Personnel:</h3>
        <p>Choose your pick</p>
        <ul className="list-group">
          <li className="list-group-item">Driver 1</li>
          <li className="list-group-item">Driver 2</li>
          <li className="list-group-item">Driver 3</li>
          <li className="list-group-item">Driver 4</li>
        </ul>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="locationInput" className="form-label">
            Select your location:
          </label>
          <input
            type="text"
            className="form-control"
            id="locationInput"
            name="location"
            onChange={handleInput}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="packageTypeInput" className="form-label">
            Package type:
          </label>
          <input
            type="text"
            className="form-control"
            id="packageTypeInput"
            name="type"
            onChange={handleInput}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="deliveryTimeInput" className="form-label">
            How soon do you need it?
          </label>
          <input
            type="text"
            className="form-control"
            id="deliveryTimeInput"
            name="time"
            onChange={handleInput}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="paymentInput" className="form-label">
            Payment
          </label>
          <input
            type="text"
            className="form-control"
            id="paymentInput"
            name="payment"
            onChange={handleInput}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">Post Order</button>
    </form>
  </div>
  );
}

export default Manager;
