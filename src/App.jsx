import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import TopicSelection from "./TopicSelection";
import QuestionsPage from "./QuestionsPage";
import ResultChart from "./ResultChart";
import ScopePage from "./ScopePage";
import Logout from "./Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topicselection" element={<TopicSelection />} />
        <Route path="/questionspage/:topic" element={<QuestionsPage />} />
        <Route path="/resultchart" element={<ResultChart />} />
        <Route path="/scope" element={<ScopePage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
