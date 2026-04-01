import React, { useState } from "react";
import { useEffect, useRef } from "react";
// Ensure 'React' is explicitly imported
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";

function ScopePageCmp() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const [image, setImage] = useState("");
  const [diagramId, setDiagramId] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [diagrams, setDiagrams] = useState([]);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get user from localStorage properly
  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.log("Invalid user data");
    }
    return null;
  })();

  const userId = user?.user_id;

  // Load all diagrams when page loads
  useEffect(
    function () {
      if (userId) {
        loadDiagrams();
        // Restore previously selected diagram from localStorage
        const savedDiagramId = localStorage.getItem("selectedDiagramId");
        const savedImagePath = localStorage.getItem("selectedDiagramPath");

        if (savedDiagramId && savedImagePath) {
          setDiagramId(parseInt(savedDiagramId));
          setImage(savedImagePath);
        }
      } else {
        setError("User not logged in");
      }
    },
    [userId],
  );

  // Load labels when diagram changes
  useEffect(() => {
    if (diagramId) {
      loadLabels(diagramId);
      // Save the selected diagram to localStorage for persistence
      localStorage.setItem("selectedDiagramId", diagramId);
    }
  }, [diagramId]);

  // Save image path to localStorage when it changes
  useEffect(() => {
    if (image) {
      localStorage.setItem("selectedDiagramPath", image);
    }
  }, [image]);

  // Function to load diagrams
  function loadDiagrams() {
    setLoading(true);
    fetch(`http://localhost:8081/getDiagrams.php?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch diagrams");
        }
        return res.json();
      })
      .then((data) => {
        console.log("DIAGRAMS loaded:", data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setDiagrams(data);

          // Restore previously selected diagram if it still exists
          const savedDiagramId = localStorage.getItem("selectedDiagramId");
          if (savedDiagramId) {
            const savedId = parseInt(savedDiagramId);
            const savedDiagram = data.find((d) => d.id === savedId);

            if (savedDiagram) {
              // Restore the diagram with full data
              setDiagramId(savedDiagram.id);
              setImage(savedDiagram.full_path);
            } else {
              // Saved diagram no longer exists, clear it
              localStorage.removeItem("selectedDiagramId");
              localStorage.removeItem("selectedDiagramPath");
            }
          }
        } else {
          setDiagrams([]);
          console.error("Invalid data format:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading diagrams:", err);
        setError("Failed to load diagrams");
        setLoading(false);
      });
  }

  // Function to load labels for a diagram
  function loadLabels(diagramId) {
    fetch(`http://localhost:8081/getLabels.php?diagram_id=${diagramId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("LABELS loaded:", data);
        setLabels(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading labels:", err);
        setLabels([]);
      });
  }

  // Upload image
  // Upload image
  function uploadImage(e) {
    var file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setLoading(true);
    setError("");

    var formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", userId);
    formData.append("filename", file.name);

    fetch("http://localhost:8081/upload.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse as JSON
      })
      .then((data) => {
        console.log("UPLOAD RESPONSE:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        // Use the full_path from response or construct it
        const fullPath = data.full_path || "http://localhost:8081/" + data.path;
        const newDiagramId = data.diagram_id;

        setImage(fullPath);
        setDiagramId(newDiagramId);
        setLabels([]);

        // Refresh diagrams list and restore selection
        loadDiagrams();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setError(err.message || "Failed to upload image");
        setLoading(false);
      });
  }

  // Load diagram from sidebar
  function loadDiagram(d) {
    setImage(d.full_path);
    setDiagramId(d.id);
    setImageDimensions({ width: 0, height: 0 });
    setSelectedLabel(null);
    setError("");
  }

  // Handle image load to get actual dimensions
  function handleImageLoad(e) {
    const img = e.target;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  }

  // Add label
  function handleClick(e) {
    if (!diagramId) {
      setError("Please select a diagram first");
      return;
    }

    if (!imageRef.current) return;

    // Get click coordinates relative to the displayed image
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    // Calculate actual image coordinates
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;

    // Ensure coordinates are within image bounds
    x = Math.max(0, Math.min(x, imageDimensions.width));
    y = Math.max(0, Math.min(y, imageDimensions.height));

    var title = prompt("Enter label name:");
    if (!title) return;

    var desc = prompt("Enter description:");
    var link = prompt("Enter topic link:");

    var newLabel = {
      x: Math.round(x),
      y: Math.round(y),
      title,
      description: desc || "",
      link: link || "",
    };

    // Optimistically update UI
    setLabels([...labels, newLabel]);

    fetch("http://localhost:8081/saveLabel.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diagram_id: diagramId,
        ...newLabel,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Label saved:", data);
      })
      .catch((err) => {
        console.error("Error saving label:", err);
        // Revert optimistic update
        loadLabels(diagramId);
        setError("Failed to save label");
      });
  }

  // Delete diagram
  function deleteDiagram(diagramIdToDelete, e) {
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this diagram and all its labels? This action cannot be undone!",
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    fetch("http://localhost:8081/deleteDiagram.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diagram_id: diagramIdToDelete,
        user_id: userId,
      }),
    })
      .then(async (response) => {
        // Check if response is OK
        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Server error (${response.status}): ${text.substring(0, 100)}`,
          );
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Delete response:", data);

        if (data.success) {
          // If the deleted diagram is currently loaded, clear it
          if (diagramIdToDelete === diagramId) {
            setImage("");
            setDiagramId(null);
            setLabels([]);
            // Clear from localStorage
            localStorage.removeItem("selectedDiagramId");
            localStorage.removeItem("selectedDiagramPath");
          }
          // Refresh diagrams list
          loadDiagrams();
          setError("");
        } else {
          throw new Error(data.error || "Failed to delete diagram");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error deleting diagram:", err);
        setError(err.message || "Failed to delete diagram. Please try again.");
        setLoading(false);
      });
  }
  // Calculate marker position based on current image display size
  function getMarkerPosition(x, y) {
    if (!imageRef.current || !imageDimensions.width) return { left: 0, top: 0 };

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageDimensions.width;
    const scaleY = rect.height / imageDimensions.height;

    return {
      left: x * scaleX,
      top: y * scaleY,
    };
  }

  // Format filename for display
  function getDisplayName(diagram) {
    // If there's a filename stored, use it
    if (diagram.filename) {
      // Remove extension and limit length
      let name = diagram.filename.replace(/\.[^/.]+$/, "");
      return name.length > 30 ? name.substring(0, 27) + "..." : name;
    }
    // Fallback to ID if no filename
    return `Diagram ${diagram.id}`;
  }

  // Unified color scheme - Blue-Green Gradient Theme
  const colors = {
    primary: "#0066ff",
    primaryDark: "#0052cc",
    secondary: "#0066ff",
    secondaryDark: "#00a86b",
    success: "#00cc99",
    successDark: "#009966",
    danger: "#ef4444",
    dangerDark: "#dc2626",
    warning: "#f59e0b",
    background:
      "linear-gradient(135deg, #0066ff 0%, #17a2b8 50%, #00cc99 100%)",
    sidebarBg: "rgba(255, 255, 255, 0.95)",
    cardBg: "rgba(255, 255, 255, 0.9)",
    border: "#e5e7eb",
    text: "#111827",
    textLight: "#6b7280",
    textLighter: "#9ca3af",
  };

  if (!userId) {
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
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2 style={{ color: "#0066ff", marginBottom: "15px" }}>
            User not logged in
          </h2>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              backgroundColor: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0052cc";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0066ff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0066ff 0%, #00cc99 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "40px 20px",
      }}
    >
      {/* Header - Matches Dashboard */}
      <div
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: "40px",
          animation: "slideDown 0.6s ease-out",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 10px 0",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Label & Revise
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            opacity: "0.95",
            fontWeight: "300",
            letterSpacing: "0.5px",
            margin: 0,
          }}
        >
          Upload and label your diagrams
        </p>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          flex: 1,
        }}
      >
        {/* LEFT SIDEBAR - DIAGRAMS LIST */}
        <div
          style={{
            width: "320px",
            minWidth: "320px",
            backgroundColor: "#ffffff",
            borderRight: "3px solid rgba(0, 102, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Sidebar Header */}
          <div
            style={{
              padding: "28px 24px",
              borderBottom: "2px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:
                "linear-gradient(135deg, rgba(0, 102, 255, 0.05) 0%, rgba(0, 204, 153, 0.05) 100%)",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#0066ff",
                  letterSpacing: "-0.5px",
                }}
              >
                My Diagrams
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                {diagrams.length} diagram{diagrams.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={loadDiagrams}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                color: "#0066ff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f7ff";
                e.currentTarget.style.transform = "rotate(180deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
              title="Refresh"
            >
              🔄
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                margin: "16px 16px 0 16px",
                padding: "12px 16px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "8px",
                fontSize: "13px",
                borderLeft: "4px solid #dc2626",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>⏳</div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                Loading diagrams...
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && diagrams.length === 0 && (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📁</div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                No diagrams yet
              </div>
              <div
                style={{ fontSize: "12px", marginTop: "8px", color: "#d1d5db" }}
              >
                Upload your first diagram to get started
              </div>
            </div>
          )}

          {/* Diagrams List */}
          {!loading && diagrams.length > 0 && (
            <div
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
              }}
            >
              {diagrams.map((d) => (
                <div
                  key={d.id}
                  onClick={() => loadDiagram(d)}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    borderRadius: "12px",
                    border:
                      diagramId === d.id
                        ? "3px solid #0066ff"
                        : "2px solid #e5e7eb",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    backgroundColor: "#fff",
                    boxShadow:
                      diagramId === d.id
                        ? "0 8px 16px rgba(0, 102, 255, 0.25)"
                        : "0 2px 4px rgba(0, 0, 0, 0.08)",
                    transform: diagramId === d.id ? "scale(1.02)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (diagramId !== d.id) {
                      e.currentTarget.style.borderColor = "#0066ff";
                      e.currentTarget.style.boxShadow =
                        "0 6px 12px rgba(0, 102, 255, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (diagramId !== d.id) {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0, 0, 0, 0.08)";
                    }
                  }}
                >
                  <img
                    src={d.full_path}
                    alt={d.filename || `Diagram ${d.id}`}
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E";
                    }}
                  />
                  <div
                    style={{
                      padding: "10px 12px",
                      backgroundColor:
                        diagramId === d.id ? "#f0f7ff" : "transparent",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <p
                      style={{
                        padding: 0,
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: "600",
                        color: diagramId === d.id ? "#0066ff" : "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getDisplayName(d)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteDiagram(d.id, e)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      fontWeight: "600",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.background = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0";
                      e.currentTarget.style.background =
                        "rgba(239, 68, 68, 0.9)";
                    }}
                    className="delete-btn"
                    title="Delete diagram"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              padding: "20px 36px",
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(10px)",
            }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                flex: 1,
                padding: "13px 24px",
                backgroundColor: "#0066ff",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 6px 16px rgba(0, 102, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0052cc";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 102, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0066ff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 102, 255, 0.3)";
              }}
            >
              ← Back to Dashboard
            </button>

            <label
              style={{
                flex: 1,
                padding: "13px 24px",
                backgroundColor: "#00cc99",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s ease",
                boxShadow: "0 6px 16px rgba(0, 204, 153, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#009966";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0, 204, 153, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00cc99";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 204, 153, 0.3)";
              }}
            >
              + Upload New Diagram
              <input
                type="file"
                onChange={uploadImage}
                style={{ display: "none" }}
                accept="image/*"
              />
            </label>
          </div>

          {/* MAIN CONTENT AREA */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            {!image ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 60px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  maxWidth: "550px",
                  width: "100%",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>🖼️</div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0066ff",
                    marginBottom: "12px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  No diagram selected
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "15px",
                    margin: 0,
                    lineHeight: "1.8",
                  }}
                >
                  Select a diagram from the sidebar
                  <br />
                  or upload a new one to get started
                </p>
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  padding: "28px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  maxWidth: "100%",
                  overflow: "auto",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    ref={imageRef}
                    src={image}
                    alt="diagram"
                    onClick={handleClick}
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "900px",
                      width: "100%",
                      height: "auto",
                      cursor: "crosshair",
                      display: "block",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />

                  {/* LABEL MARKERS */}
                  {labels.map((l, index) => {
                    const position = getMarkerPosition(l.x, l.y);
                    return (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          left: position.left,
                          top: position.top,
                          width: "16px",
                          height: "16px",
                          background: "#ef4444",
                          border: "3px solid white",
                          borderRadius: "50%",
                          cursor: "pointer",
                          transform: "translate(-50%, -50%)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                          transition: "all 0.2s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLabel(l);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translate(-50%, -50%) scale(1.4)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translate(-50%, -50%) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0, 0, 0, 0.25)";
                        }}
                      />
                    );
                  })}
                </div>

                {labels.length > 0 && (
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "14px 18px",
                      background:
                        "linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 204, 153, 0.08) 100%)",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#0066ff",
                      textAlign: "center",
                      border: "1px solid rgba(0, 102, 255, 0.2)",
                      fontWeight: "500",
                    }}
                  >
                    💡 <strong>Click any dot</strong> to view details |{" "}
                    <strong>Click anywhere on the image</strong> to add a label
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* POPUP MODAL */}
        {selectedLabel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setSelectedLabel(null)}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.98)",
                padding: "32px",
                borderRadius: "18px",
                minWidth: "340px",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  color: "#0066ff",
                  fontSize: "22px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
                {selectedLabel.title}
              </h3>
              <div
                style={{
                  width: "50px",
                  height: "4px",
                  background: "linear-gradient(90deg, #0066ff, #00cc99)",
                  margin: "16px 0 20px 0",
                  borderRadius: "2px",
                }}
              />
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: "#6b7280",
                  lineHeight: "1.7",
                  fontSize: "15px",
                }}
              >
                {selectedLabel.description || "No description provided"}
              </p>
              {selectedLabel.link && (
                <a
                  href={selectedLabel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "24px",
                    color: "#0066ff",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#00cc99";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#0066ff";
                  }}
                >
                  Learn more →
                </a>
              )}
              <button
                onClick={() => setSelectedLabel(null)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#0066ff",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 6px 16px rgba(0, 102, 255, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0052cc";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 102, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066ff";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0, 102, 255, 0.3)";
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </div>
  );
}

export default ScopePageCmp;
