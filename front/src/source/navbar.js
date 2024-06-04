import React, { useContext, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext, UserContextProvider } from "../context/userContext";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Navbar() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(UserContext);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8081/logout");
      setIsAuthenticated(false);
      toast.success("Logged out");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user) {
    setIsAuthenticated(true);
  }

  return (
    <UserContextProvider>
      <Fragment>
        {isAuthenticated ? (
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              {user && <NavLink>{user.username}</NavLink>}
              <br />
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/manager">
                      Manager
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/delivery">
                      Delivery
                    </Link>
                  </li>
                  {user ? (
                    <li className="nav-item" onClick={handleLogout}>
                      <Link className="nav-link" to="/">
                        Log out
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        ) : null}
      </Fragment>
    </UserContextProvider>
  );
}
