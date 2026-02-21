import { useEffect, useState } from "react";

function Scope() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost/getScope.php")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h2>Career Scope & Roadmap</h2>
      {data ? (
        <div>
          <p>
            <strong>Weak Area:</strong> {data.weak_area}
          </p>
          <p>
            <strong>Suggestion:</strong> {data.suggestion}
          </p>
          <p>
            <strong>Roadmap:</strong> {data.roadmap}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Scope;
