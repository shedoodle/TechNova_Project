import React, { useState } from "react";
import MotionDashboard from "./components/MotionDashboard";
import MPReportCard from "./components/MPReportCard";

function App() {
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" or "mp-report"
  const [postalCode, setPostalCode] = useState("");
  const [mpData, setMpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePostalCodeSubmit = async (e) => {
    e.preventDefault();
    if (!postalCode.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      // Lookup MP by postal code
      const mpResponse = await fetch(`http://localhost:5001/api/mp/${postalCode}`);
      if (!mpResponse.ok) {
        throw new Error('Failed to lookup MP');
      }
      const mp = await mpResponse.json();
      setMpData(mp);
      setCurrentView("mp-report");
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Is Your MP an MP? (Massive Piece...)</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setCurrentView("dashboard")}
            style={{ 
              padding: "8px 16px", 
              backgroundColor: currentView === "dashboard" ? "#007bff" : "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Motion Dashboard
          </button>
          <button 
            onClick={() => setCurrentView("mp-report")}
            style={{ 
              padding: "8px 16px", 
              backgroundColor: currentView === "mp-report" ? "#007bff" : "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            MP Report Card
          </button>
        </div>
      </div>

      {currentView === "dashboard" ? (
        <MotionDashboard />
      ) : (
        <div>
          {/* Postal Code Lookup */}
          <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Find Your MP</h2>
            <form onSubmit={handlePostalCodeSubmit}>
              <input
                type="text"
                placeholder="Enter Canadian postal code (e.g., K1A 0A6)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                style={{ padding: "8px", marginRight: "8px", width: "300px" }}
              />
              <button 
                type="submit" 
                disabled={loading}
                style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
              >
                {loading ? "Looking up..." : "Find MP"}
              </button>
            </form>
            {error && <p style={{ color: "red", marginTop: "8px" }}>Error: {error}</p>}
          </div>

          {/* MP Information */}
          {mpData && <MPReportCard mpData={mpData} />}
        </div>
      )}
    </div>
  );
}

export default App;
