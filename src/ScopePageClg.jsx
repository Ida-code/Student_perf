import { Link } from "react-router-dom";
import { Code, Palette, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ScopePageClg() {
  const navigate = useNavigate();

  const paths = [
    {
      title: "Software Developer",
      desc: "Frontend, Backend & Full Stack development roadmap",
      icon: <Code className="w-10 h-10 text-indigo-500" />,
      link: "/roadmap/developer",
      tags: ["React", "Node.js", "SQL"],
    },
    {
      title: "AI ML",
      desc: "Learn design thinking, wireframing and prototyping",
      icon: <Palette className="w-10 h-10 text-purple-500" />,
      link: "/roadmap/aiml",
      tags: ["ML", "Computer Vision", "Projects"],
    },
    {
      title: "DevOps Engineer",
      desc: "Infrastructure, CI/CD pipelines and automation",
      icon: <Settings className="w-10 h-10 text-pink-500" />,
      link: "/roadmap/devops",
      tags: ["Docker", "AWS", "Jenkins"],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6">
      {/* 🔥 TOP RIGHT BACK BUTTON */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-md transition"
      >
        ← Back
      </button>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
          Choose Your Career Path
        </h1>

        <p className="text-indigo-100 text-lg">
          Select a domain to view your personalized learning roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {paths.map((path, index) => (
          <Link to={path.link} key={index} className="group">
            <div className="h-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl flex flex-col items-center text-center border-2 border-transparent group-hover:border-white/50">
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors duration-300">
                {path.icon}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {path.title}
              </h2>

              <p className="text-gray-600 mb-6 flex-grow">{path.desc}</p>

              <div className="flex flex-wrap justify-center gap-2">
                {path.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ScopePageClg;
