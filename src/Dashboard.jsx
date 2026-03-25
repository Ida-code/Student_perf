import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  function goToTopicSelection() {
    navigate("/topicselection");
  }

  function goToResults() {
    navigate("/resultchart");
  }

  function goToScope() {
    navigate("/scoperouter");
  }

  function logout() {
    fetch("http://localhost/Stud_Perf/logoutstud.php", {
      credentials: "include",
    }).then(() => {
      navigate("/");
    });
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={goToTopicSelection}>Pick A Topic</button>
      <button onClick={goToResults}>Results</button>
      <button onClick={goToScope}>Scope</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
