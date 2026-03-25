import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function Roadmap() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState([]);

  const data = {
    developer: [
      {
        title: "HTML & CSS",
        link: "https://youtu.be/v8jDnBYc0bs?si=xrhKWGV891iX2K2R",
      },
      {
        title: "JavaScript",
        link: "https://youtu.be/nkB3_dIDC08?si=R68iuvbDWhZe3Pwr",
      },
      {
        title: "React",
        link: "https://youtu.be/BT1gpzX58bI?si=b5UXinE5XAftGys8",
      },
      {
        title: "Node.js",
        link: "https://youtu.be/yEHCfRWz-EI?si=MvIKalxKnhzUDNgy",
      },
      {
        title: "Database",
        link: "https://youtu.be/ZdQP1HUOEAU?si=nxn8ryehDmGf7LvM",
      },
      {
        title: "Deployment",
        link: "https://youtu.be/NBrQp6-721c?si=kuwt9qAi-MPravV4",
      },
    ],

    aiml: [
      { title: "Python Basics", link: "https://youtu.be/_uQrJ0TkZlc" },
      {
        title: "Math (Stats & Linear Algebra)",
        link: "https://youtu.be/QCPJ0VdpM00?si=GmrK_20w6odneyW1",
      },
      {
        title: "Data Analysis (Pandas, Numpy)",
        link: "https://youtu.be/vtgDGrUiUKk?si=akJ-BpbPXogCDBW7",
      },
      {
        title: "Machine Learning",
        link: "https://youtu.be/gmvvaobm7eQ?si=N-XPQRXXUb9wRR5T",
      },
      {
        title: "Deep Learning",
        link: "https://youtu.be/Mubj_fqiAv8?si=EpbsfN-jrlQFHGap",
      },
      {
        title: "Projects",
        link: "https://www.geeksforgeeks.org/machine-learning/machine-learning-projects/",
      },
    ],

    devops: [
      { title: "Linux Basics", link: "https://youtu.be/IVquJh3DXUA" },
      { title: "Git & GitHub", link: "https://youtu.be/RGOj5yH7evk" },
      { title: "Docker", link: "https://youtu.be/fqMOX6JJhGo" },
      { title: "CI/CD", link: "https://youtu.be/1er2cjUq1UI" },
      { title: "Kubernetes", link: "https://youtu.be/X48VuDVv0do" },
      { title: "Cloud (AWS/Azure)", link: "https://youtu.be/ulprqHHWlng" },
    ],
  };

  const steps = data[type] || data.developer;

  const points = [
    { x: "10%", y: "75%" },
    { x: "25%", y: "50%" },
    { x: "40%", y: "25%" },
    { x: "60%", y: "35%" },
    { x: "75%", y: "60%" },
    { x: "90%", y: "80%" },
  ];

  // Only allow marking once
  function markDone(index) {
    if (completed.indexOf(index) === -1) {
      setCompleted([...completed, index]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center p-6">
      {/* Small Back Button at Top Left */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-20 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-md transition-all duration-200"
      >
        ← Back
      </button>

      <div className="relative w-full max-w-6xl h-[600px] mx-auto">
        {/* SVG */}
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          pointerEvents="none"
        >
          <path
            d="M100,450 Q250,200 400,150 T650,200 Q800,350 900,500"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 8"
          />
        </svg>

        {/* STEPS */}
        {steps.map(function (step, index) {
          const isDone = completed.indexOf(index) !== -1;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: points[index].y,
                left: points[index].x,
                transform: "translate(-50%, -50%)",
              }}
              className="flex flex-col items-center z-10"
            >
              {/* CLICKABLE CIRCLE */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg cursor-pointer
                  ${isDone ? "bg-green-500" : "bg-indigo-600"}`}
                onClick={function () {
                  window.open(step.link, "_blank");
                }}
              >
                {isDone ? "✓" : index + 1}
              </div>

              {/* CLICKABLE TEXT */}
              <p
                className="mt-2 text-white text-sm text-center cursor-pointer hover:underline"
                onClick={function () {
                  window.open(step.link, "_blank");
                }}
              >
                {step.title}
              </p>

              {/* MARK DONE (ONE WAY ONLY) */}
              {!isDone && (
                <button
                  onClick={function () {
                    markDone(index);
                  }}
                  className="mt-1 text-xs bg-white text-black px-2 py-1 rounded hover:bg-gray-200"
                >
                  Mark Done
                </button>
              )}

              {/* DONE LABEL */}
              {isDone && (
                <span className="mt-1 text-xs text-green-200 font-semibold">
                  Completed
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Roadmap;
