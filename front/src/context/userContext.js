import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toContractor, setToContractor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.withCredentials = true; // Ensure credentials are sent
        const { data } = await axios.get("http://localhost:8081/profile");
        if (data && data.username) {
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        toContractor,
        setToContractor,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
}
