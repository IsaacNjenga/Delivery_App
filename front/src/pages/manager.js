import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Select from "react-select";

function Manager() {
  const navigate = useNavigate();
  const [order, setOrder] = useState({});
  const [deliverers, setDeliverers] = useState([]);
  const { user, setIsAuthenticated } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user, setIsAuthenticated]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/delivery_personnel"
        );
        setDeliverers(response.data);
      } catch (error) {
        toast.error("Error fetching item");
      }
    };
    fetchItems();
  }, []);

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const handleDelivererSelection = (selectedOption) => {
    if (selectedOption.value === "free_for_all") {
      setOrder((prev) => ({
        ...prev,
        delivererId: null,
        delivererName: "Free for All",
      }));
    } else {
      const selectedDeliverer = deliverers.find(
        (deliverer) => deliverer.id === selectedOption.value
      );
      if (selectedDeliverer) {
        setOrder((prev) => ({
          ...prev,
          delivererId: selectedDeliverer.id,
          delivererName: selectedDeliverer.username,
        }));
      }
    }
  };

  const handleInput = (e) => {
    setOrder((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = { ...order, name: user.username.toUpperCase() };
    axios
      .post("http://localhost:8081/order", orderData)
      .then((res) => {
        toast.success("Order posted");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error posting order");
      });
  };

  const delivererOptions = [
    {
      value: "free_for_all",
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Free for All</span>
        </div>
      ),
    },
    ...deliverers.map((deliverer) => ({
      value: deliverer.id,
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{`${deliverer.id} - ${deliverer.username}`}</span>
        </div>
      ),
    })),
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Post an order</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nameInput" className="form-label">
            Contractor:
          </label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            name="name"
            readOnly
            value={user.username}
          />
        </div>
        <div className="mb-3">
          <h3>Available Delivery Personnel:</h3>
          <p>Choose your pick</p>
          <Select
            styles={customStyles}
            options={delivererOptions}
            onChange={handleDelivererSelection}
            placeholder="Select"
          />
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="locationInput" className="form-label">
              Your location:
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
            <select
              className="form-control"
              id="packageTypeInput"
              onChange={(e) => {
                setOrder({ ...order, type: e.target.value.toUpperCase() });
              }}
            >
              <option value="" disabled selected>
                Select type
              </option>
              <option value="big">Big</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="deliveryTimeInput" className="form-label">
              How soon do you need it?
            </label>
            <select
              className="form-control"
              id="deliveryTimeInput"
              value={order.time}
              onChange={(e) => {
                setOrder({ ...order, time: e.target.value.toUpperCase() });
              }}
            >
              <option value="" disabled selected>
                Select time
              </option>
              <option value="immediately">Immediately</option>
              <option value="soon">Soon</option>
              <option value="later">Later</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="paymentInput" className="form-label">
              Payment
            </label>
            <select
              className="form-control"
              id="paymentInput"
              value={order.payment}
              onChange={(e) => {
                setOrder({ ...order, payment: e.target.value.toUpperCase() });
              }}
            >
              <option value="" disabled selected>
                Select payment
              </option>
              <option value="on delivery">On delivery</option>
              <option value="on assignment">On assignment</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="payInput" className="form-label">
              Pay:
            </label>
            <input
              type="text"
              className="form-control"
              id="payInput"
              name="pay"
              placeholder="Enter offered amount"
              onChange={handleInput}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="bargainInput" className="form-label">
              Set bargain
            </label>
            <select
              className="form-control"
              id="bargainInput"
              onChange={(e) => {
                setOrder({ ...order, bargain: e.target.value.toUpperCase() });
              }}
            >
              <option value="" disabled selected>
                Select type
              </option>
              <option value="negotiable">Negotiable</option>
              <option value="non-negotiable">Non-negotiable</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Post Order
        </button>
      </form>
    </div>
  );
}

export default Manager;
