import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminLogin from "./AdminLogin";
import Panel from "./Panel";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function AppRoutes() {
  const navigate = useNavigate();
 useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("https://backend-195k.onrender.com/api/common/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res)

        if (!res.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const check = await res.json();
        console.log(check);

        // Adjust this condition to match your backend response format
        if (check?.valid) {
          navigate("/panel");
        } else {
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
      <ToastContainer
        position="top-right"   // Where toast appears
        autoClose={3000}       // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
         
     </div>
    
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
