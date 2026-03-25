import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

  const userId = localStorage.getItem("userId");

  // Load all diagrams when page loads
  useEffect(
    function () {
      if (userId) {
        loadDiagrams();
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
    }
  }, [diagramId]);

  // Function to load diagrams
  function loadDiagrams() {
    setLoading(true);
    fetch(`http://localhost/Stud_Perf/getDiagrams.php?user_id=${userId}`)
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
    fetch(`http://localhost/Stud_Perf/getLabels.php?diagram_id=${diagramId}`)
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

    fetch("http://localhost/Stud_Perf/upload.php", {
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

        var fullPath = "http://localhost/Stud_Perf/" + data.path;
        setImage(fullPath);
        setDiagramId(data.diagram_id);
        setLabels([]);

        // Refresh diagrams list
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

    fetch("http://localhost/Stud_Perf/saveLabel.php", {
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
  // Delete diagram
  function deleteDiagram(diagramId, e) {
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

    fetch("http://localhost/Stud_Perf/deleteDiagram.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diagram_id: diagramId,
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
          if (diagramId === diagramId) {
            setImage("");
            setDiagramId(null);
            setLabels([]);
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

  // Unified color scheme
  const colors = {
    primary: "#3b82f6",
    primaryDark: "#2563eb",
    secondary: "#6b7280",
    secondaryDark: "#4b5563",
    success: "#10b981",
    successDark: "#059669",
    danger: "#ef4444",
    dangerDark: "#dc2626",
    warning: "#f59e0b",
    background: "#f9fafb",
    sidebarBg: "#ffffff",
    cardBg: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    textLight: "#6b7280",
    textLighter: "#9ca3af",
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: colors.background,
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "280px",
          minWidth: "280px",
          borderRight: `1px solid ${colors.border}`,
          padding: "24px 16px",
          overflowY: "auto",
          backgroundColor: colors.sidebarBg,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "600",
              color: colors.text,
            }}
          >
            Your Diagrams
          </h3>
          <button
            onClick={loadDiagrams}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: colors.textLight,
              padding: "4px 8px",
              borderRadius: "6px",
            }}
            title="Refresh"
          >
            🔄
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#fee2e2",
              color: colors.dangerDark,
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <div style={{ color: colors.textLight }}>Loading...</div>
          </div>
        ) : diagrams.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              backgroundColor: colors.background,
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                color: colors.textLight,
                fontSize: "14px",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              No diagrams yet.
              <br />
              Upload your first diagram!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {diagrams.map((d) => (
              <div
                key={d.id}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  border:
                    diagramId === d.id
                      ? `2px solid ${colors.primary}`
                      : `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  padding: "12px",
                  backgroundColor:
                    diagramId === d.id ? `${colors.primary}08` : colors.cardBg,
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
                onClick={() => loadDiagram(d)}
              >
                <img
                  src={d.full_path}
                  alt={d.filename || `Diagram ${d.id}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "6px",
                    display: "block",
                    border: `1px solid ${colors.border}`,
                  }}
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: diagramId === d.id ? colors.primary : colors.text,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getDisplayName(d)}
                </p>
                <button
                  onClick={(e) => deleteDiagram(d.id, e)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: colors.danger,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "1")}
                  onMouseLeave={(e) => (e.target.style.opacity = "0")}
                  className="delete-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <style>{`
          div:hover > .delete-btn {
            opacity: 1 !important;
          }
        `}</style>
      </div>

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          backgroundColor: colors.background,
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            padding: "20px 32px",
            backgroundColor: colors.sidebarBg,
            borderBottom: `1px solid ${colors.border}`,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "8px 20px",
                cursor: "pointer",
                backgroundColor: colors.secondary,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.secondaryDark)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = colors.secondary)
              }
            >
              ← Back to Dashboard
            </button>

            <label
              style={{
                padding: "8px 20px",
                cursor: "pointer",
                backgroundColor: colors.success,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.successDark)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = colors.success)
              }
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
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {!image ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 48px",
                backgroundColor: colors.cardBg,
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.border}`,
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🖼️</div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: colors.text,
                  marginBottom: "12px",
                }}
              >
                No diagram selected
              </p>
              <p
                style={{
                  color: colors.textLight,
                  fontSize: "14px",
                  margin: 0,
                  lineHeight: "1.5",
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
                backgroundColor: colors.cardBg,
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.border}`,
                maxWidth: "100%",
                overflow: "auto",
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
                    maxWidth: "800px",
                    width: "100%",
                    height: "auto",
                    cursor: "crosshair",
                    display: "block",
                    borderRadius: "8px",
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
                        width: "14px",
                        height: "14px",
                        background: colors.danger,
                        border: `2px solid ${colors.cardBg}`,
                        borderRadius: "50%",
                        cursor: "pointer",
                        transform: "translate(-50%, -50%)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "all 0.2s ease",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLabel(l);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform =
                          "translate(-50%, -50%) scale(1.3)";
                        e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform =
                          "translate(-50%, -50%) scale(1)";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
                      }}
                    />
                  );
                })}
              </div>

              {labels.length > 0 && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "12px 16px",
                    backgroundColor: colors.background,
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: colors.textLight,
                    textAlign: "center",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  💡 <strong>Tip:</strong> Click on any red dot to view details
                  | Click anywhere on the image to add a new label
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedLabel(null)}
        >
          <div
            style={{
              background: colors.cardBg,
              padding: "28px",
              borderRadius: "16px",
              minWidth: "320px",
              maxWidth: "480px",
              width: "90%",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              border: `1px solid ${colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                color: colors.text,
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {selectedLabel.title}
            </h3>
            <div
              style={{
                width: "40px",
                height: "3px",
                backgroundColor: colors.primary,
                margin: "12px 0 16px 0",
                borderRadius: "2px",
              }}
            />
            <p
              style={{
                margin: "0 0 16px 0",
                color: colors.textLight,
                lineHeight: "1.6",
                fontSize: "14px",
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
                  gap: "6px",
                  marginBottom: "20px",
                  color: colors.primary,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Learn more →
              </a>
            )}
            <button
              onClick={() => setSelectedLabel(null)}
              style={{
                marginTop: "8px",
                padding: "10px 20px",
                backgroundColor: colors.secondary,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.secondaryDark)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = colors.secondary)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScopePageCmp;
