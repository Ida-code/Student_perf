import React, { useState } from "react"; // Ensure 'React' is explicitly imported

import ScopePageClg from "./ScopePageClg";
import ScopePageCmp from "./ScopePageCmp";

function ScopeRouter() {
  var user = null;

  try {
    var data = localStorage.getItem("user");
    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }
  } catch (e) {
    console.log("Invalid user data");
  }

  console.log("USER:", user); // debug

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0066ff, #00cc99)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2 style={{ color: "#0066ff", marginBottom: "15px" }}>
            Please Login
          </h2>
          <p style={{ color: "#666" }}>
            You need to log in to access this page
          </p>
        </div>
      </div>
    );
  }

  if (user.role === "college") {
    return <ScopePageClg />;
  } else if (user.role === "competitive") {
    return <ScopePageCmp />;
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #0066ff, #00cc99)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2 style={{ color: "#dc3545", marginBottom: "15px" }}>
            No Scope Available
          </h2>
          <p style={{ color: "#666" }}>
            Your role doesn't have a scope available
          </p>
        </div>
      </div>
    );
  }
}

export default ScopeRouter;
