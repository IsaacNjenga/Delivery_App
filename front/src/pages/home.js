import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cancel from "../delete.png";

function Home() {
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [allJobs, setAllJobs] = useState(false);
  const [appliedOrders, setAppliedOrders] = useState(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8081");
        if (res.data.valid) {
          setName(res.data.username);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login"); // Handle error by redirecting to login
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8081/allJobs");
        const filteredOrders = res.data.filter((order) => order.name === name);
        setOrders(filteredOrders);
        setAllJobs(true);
      } catch (err) {
        console.error("Error fetching all jobs:", err);
        // Handle error if needed, such as showing a message to the user
      }
    };
    fetchAllJobs();
  }, [name]);

  const cancelOrder = async (index, id) => {
    setAppliedOrders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });

    try {
      await axios.delete(`http://localhost:8081/orders/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome {name}</p>
      {allJobs && (
        <div className="mt-4">
          <h2 className="text-center mb-4">Orders you have posted</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Location</th>
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
                    <img
                      src={cancel}
                      onClick={() => cancelOrder(index, order.id)}
                      className="tick"
                      alt="cancel"
                      style={{ cursor: "pointer" }}
                    />
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

export default Home;
