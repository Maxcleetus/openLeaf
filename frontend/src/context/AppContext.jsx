import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch details from backend
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch("https://open-leaf.vercel.app/api/common/details");
        if (!res.ok) {
          throw new Error("Failed to fetch details");
        }
        const data = await res.json();
        
        // Reverse the data before setting it
        const reversedData = Array.isArray(data) ? [...data].reverse() : [];
        setDetails(reversedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const value = { details, loading, error };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
