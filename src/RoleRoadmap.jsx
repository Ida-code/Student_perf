import React, { useState } from "react";
import { useParams } from "react-router-dom";
// Ensure 'React' is explicitly imported
function RoleRoadmap() {
  const { role } = useParams();

  const roadmaps = {
    developer: [
      {
        level: "01",
        skill: "HTML Basics",
        link: "https://www.w3schools.com/html/",
      },
      {
        level: "02",
        skill: "CSS Fundamentals",
        link: "https://www.w3schools.com/css/",
      },
      {
        level: "03",
        skill: "JavaScript",
        link: "https://www.w3schools.com/js/",
      },
      { level: "04", skill: "React Basics", link: "https://react.dev/learn" },
      { level: "05", skill: "Node.js", link: "https://nodejs.org/en/docs/" },
      {
        level: "06",
        skill: "Database Basics",
        link: "https://www.w3schools.com/sql/",
      },
      { level: "07", skill: "APIs", link: "https://www.restapitutorial.com/" },
      {
        level: "08",
        skill: "Version Control",
        link: "https://git-scm.com/doc",
      },
      {
        level: "09",
        skill: "Testing",
        link: "https://jestjs.io/docs/getting-started",
      },
      { level: "10", skill: "Deployment", link: "https://vercel.com/docs" },
    ],

    uiux: [
      {
        level: "01",
        skill: "Design Principles",
        link: "https://www.interaction-design.org/",
      },
      { level: "02", skill: "Wireframing", link: "https://www.figma.com/" },
      { level: "03", skill: "Prototyping", link: "https://www.figma.com/" },
      {
        level: "04",
        skill: "User Research",
        link: "https://www.nngroup.com/articles/",
      },
      {
        level: "05",
        skill: "Visual Design",
        link: "https://www.adobe.com/products/photoshop.html",
      },
      {
        level: "06",
        skill: "Interaction Design",
        link: "https://www.interaction-design.org/",
      },
      {
        level: "07",
        skill: "Usability Testing",
        link: "https://www.usability.gov/",
      },
      {
        level: "08",
        skill: "Design Systems",
        link: "https://material.io/design",
      },
      { level: "09", skill: "Accessibility", link: "https://www.w3.org/WAI/" },
      {
        level: "10",
        skill: "Portfolio Building",
        link: "https://www.behance.net/",
      },
    ],

    devops: [
      { level: "01", skill: "Linux Basics", link: "https://linuxjourney.com/" },
      {
        level: "02",
        skill: "Docker",
        link: "https://www.docker.com/101-tutorial/",
      },
      { level: "03", skill: "CI/CD", link: "https://www.jenkins.io/doc/" },
      {
        level: "04",
        skill: "Cloud Basics",
        link: "https://aws.amazon.com/training/",
      },
      {
        level: "05",
        skill: "Kubernetes",
        link: "https://kubernetes.io/docs/tutorials/",
      },
      {
        level: "06",
        skill: "Infrastructure as Code",
        link: "https://www.terraform.io/",
      },
      { level: "07", skill: "Monitoring", link: "https://prometheus.io/docs/" },
      { level: "08", skill: "Security", link: "https://www.cybrary.it/" },
      {
        level: "09",
        skill: "Scripting",
        link: "https://www.python.org/about/gettingstarted/",
      },
      {
        level: "10",
        skill: "Networking",
        link: "https://www.comptia.org/certifications/network",
      },
    ],
  };

  const levels = roadmaps[role];
  const roleTitles = {
    developer: "Software Developer",
    uiux: "UI/UX Designer",
    devops: "DevOps Engineer",
  };

  if (!levels) {
    return <h2 style={{ padding: "40px" }}>Roadmap not found</h2>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {roleTitles[role]} Roadmap
          </h1>
          <p className="text-gray-600 text-lg">
            Follow these 10 steps to master {roleTitles[role]}
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {levels.map((item) => (
            <div
              key={item.level}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-6 flex flex-col items-center text-center">
                {/* Number Circle */}
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">
                    {item.level}
                  </span>
                </div>

                {/* Skill Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.skill}
                </h3>

                {/* Action Buttons */}
                <div className="space-y-2 w-full">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium"
                  >
                    Learn More
                  </a>

                  <button className="w-full px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-300 text-sm font-medium">
                    ✓ Mark Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Your Progress
              </h4>
              <p className="text-gray-600">
                Complete all 10 skills to become a job-ready {roleTitles[role]}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">0/10</div>
                <div className="text-sm text-gray-500">Skills Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0%</div>
                <div className="text-sm text-gray-500">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleRoadmap;
