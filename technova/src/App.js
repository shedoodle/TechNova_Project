import React, { useState } from "react";

function App() {
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
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Canadian MP Report Card</h1>
      
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
      {mpData && (
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2>Your Member of Parliament</h2>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {mpData.photo && (
              <img 
                src={mpData.photo} 
                alt={mpData.name}
                style={{ width: "150px", height: "150px", borderRadius: "8px", objectFit: "cover" }}
              />
            )}
            <div>
              <h3>{mpData.name}</h3>
              <p><strong>Riding:</strong> {mpData.riding}</p>
              <p><strong>Party:</strong> {mpData.party}</p>
              <p><strong>Email:</strong> <a href={`mailto:${mpData.email}`}>{mpData.email}</a></p>
              {mpData.url && (
                <p><strong>Profile:</strong> <a href={mpData.url} target="_blank" rel="noopener noreferrer">View Official Profile</a></p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
