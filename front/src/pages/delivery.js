import axios from "axios";
import React, { useState } from "react";

function Delivery() {
  const [orders, setOrders] = useState([]);
  const [allJobs, setAllJobs] = useState(false);

  const viewMyJobs = () => {
    setAllJobs(false);
  };
  const viewAllJobs = () => {
    setAllJobs(true);
    axios
      .get("http://localhost:8081/allJobs")
      .then((res) => {
        console.log(res);
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };
  const applyForJob = () => {
    setAllJobs(false);
  };
  return (
    <div className="container mt-5">
    <h1 className="text-center mb-4">Delivery Dashboard</h1>
    <div className="d-flex justify-content-center mb-3">
      <button className="btn btn-primary mx-2" onClick={viewMyJobs}>View My Jobs</button>
      <button className="btn btn-secondary mx-2" onClick={viewAllJobs}>View All Jobs</button>
      <button className="btn btn-success mx-2" onClick={applyForJob}>Apply for a Job</button>
    </div>
    {allJobs && (
      <div className="mt-4">
         <h2 className="text-center mb-4">Available Jobs</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Location</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Time</th>
            <th scope="col">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{order.location}</td>
              <td>{order.name}</td>
              <td>{order.type}</td>
              <td>{order.time}</td>
              <td>{order.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )}
  </div>
  );
}

export default Delivery;
