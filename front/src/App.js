import React from "react";
import "./App.css";
import Navbar from "./source/navbar";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Toaster } from "react-hot-toast";
import Manager from "./pages/manager";
import Delivery from "./pages/delivery";
import { UserContextProvider } from "./context/userContext";

function App() {
  return (
    <UserContextProvider>
      <div>
        <BrowserRouter>
          <Navbar />
          <Toaster position="top-right" options={1500} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContextProvider>
  );
}

export default App;
