import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend (optional if you're not using PHP sessions)
    fetch("http://localhost/Stud_Perf/logoutstud.php", {
      method: "POST",
    })
      .catch((err) => {
        console.error("Logout API error:", err);
      })
      .finally(() => {
        // ✅ CLEAR CORRECT KEYS
        localStorage.removeItem("userId");
        localStorage.removeItem("username");

        // (optional) clear everything
        // localStorage.clear();

        // ✅ Redirect to login
        navigate("/");
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Logging you out...</p>
    </div>
  );
}

export default Logout;
