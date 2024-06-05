import axios from "axios";
import React, { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import tick from "../check.png";
import cancel from "../delete.png";

function Delivery() {
  const { toContractor, setToContractor } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [allJobs, setAllJobs] = useState(false);
  const [appliedOrders, setAppliedOrders] = useState(new Set());

  const viewMyJobs = () => {
    setAllJobs(false);
  };

  const viewAllJobs = () => {
    setAllJobs(true);
    axios
      .get("http://localhost:8081/allJobs")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  const applyForJob = () => {
    setAllJobs(false);
  };

  const takeOrder = (index) => {
    setAppliedOrders((prev) => new Set(prev).add(index));
    //setToContractor("Would like to take the job");
  };

  const cancelOrder = (index) => {
    setAppliedOrders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Delivery Dashboard</h1>
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary mx-2" onClick={viewMyJobs}>
          View My Jobs
        </button>
        <button className="btn btn-secondary mx-2" onClick={viewAllJobs}>
          View All Jobs
        </button>
        <button className="btn btn-success mx-2" onClick={applyForJob}>
          Apply for a Job
        </button>
      </div>
      {allJobs && (
        <div className="mt-4">
          <h2 className="text-center mb-4">Available Jobs</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Location</th>
                <th scope="col">Contractor</th>
                <th scope="col">Selected Courier</th>
                <th scope="col">Type</th>
                <th scope="col">Time</th>
                <th scope="col">Payment</th>
                <th scope="col">Offered pay</th>
                <th scope="col">Set bargain</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{order.location}</td>
                  <td>{order.name}</td>
                  <td>
                    {order.delivererName ? order.delivererName : "Not Assigned"}
                  </td>
                  <td>{order.type}</td>
                  <td>{order.time}</td>
                  <td>{order.payment}</td>
                  <td>
                    Ksh. {order.pay ? Number(order.pay).toLocaleString() : "0"}
                  </td>
                  <td>{order.bargain}</td>
                  <td>
                    {appliedOrders.has(index) ? (
                      <span>
                        <img src={tick} className="tick" alt="tick" />{" "}
                        <img
                          src={cancel}
                          onClick={() => cancelOrder(index)}
                          className="tick"
                          alt="cancel"
                          style={{ cursor: "pointer" }}
                        />
                      </span>
                    ) : (
                      <button
                        className="btn btn-success mx-2"
                        onClick={() => takeOrder(index)}
                      >
                        Apply
                      </button>
                    )}
                  </td>
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
