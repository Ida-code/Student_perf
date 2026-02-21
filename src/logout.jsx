import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Call the PHP backend to destroy the session
    fetch("http://localhost/logoutstud.php", {
      credentials: "include", // Essential to send/clear session cookies
    })
      .then((response) => {
        // 2. Clear any local storage if you used it for user data
        localStorage.removeItem("user_name");

        // 3. Redirect to the Login page
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        // Even if fetch fails, we usually force the user back to Login
        navigate("/");
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Logging you out safely...</p>
    </div>
  );
}

export default Logout;
