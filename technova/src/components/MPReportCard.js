import React from 'react';

const MPReportCard = ({ mpData }) => {
  return (
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
  );
};

export default MPReportCard;
