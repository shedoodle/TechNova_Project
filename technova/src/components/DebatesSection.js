import React, { useState, useEffect } from 'react';

const DebatesSection = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/debates');
      if (!response.ok) {
        throw new Error('Failed to fetch debates');
      }
      const data = await response.json();
      setDebates(data.debates || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching debates:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading parliamentary debates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <div>Error loading debates: {error}</div>
        <button 
          onClick={fetchDebates}
          style={{ marginTop: '1rem', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>🗣️</span>
        Recent Parliamentary Debates ({debates.length})
      </h3>
      
      {debates.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {debates.map(debate => (
            <div key={debate.id} style={{
              border: '1px solid #dee2e6',
              borderRadius: '12px',
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#333',
                    fontSize: '1.1rem',
                    lineHeight: '1.3'
                  }}>
                    {debate.title}
                  </h4>
                  <p style={{ 
                    color: '#666', 
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}>
                    {debate.summary}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginLeft: '1rem'
                }}>
                  <span style={{ 
                    color: '#6c757d',
                    fontSize: '0.9rem'
                  }}>
                    {new Date(debate.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div>
                  <strong style={{ color: '#333', marginRight: '1rem' }}>Speaker:</strong>
                  <span style={{ color: '#333' }}>{debate.speaker}</span>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                    {debate.party} • {debate.riding}
                  </div>
                </div>
                <a 
                  href={debate.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                  }}
                >
                  View Full Debate
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          No recent debates available.
        </div>
      )}
    </div>
  );
};

export default DebatesSection;
