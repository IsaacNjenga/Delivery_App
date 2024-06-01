import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.username);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  });
  axios.defaults.withCredentials = true;
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {name}</p>
    </div>
  );
}

export default Home;
