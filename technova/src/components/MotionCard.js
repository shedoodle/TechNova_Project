import React, { useState } from 'react';

const MotionCard = ({ motion, onVote }) => {
  const [userVote, setUserVote] = useState(null);
  const [showMPVotes, setShowMPVotes] = useState(false);

  const handleVote = (voteType) => {
    if (userVote === voteType) {
      // If clicking the same vote, remove the vote
      setUserVote(null);
      // In a real app, you'd make an API call to remove the vote
    } else {
      setUserVote(voteType);
      onVote(motion.id, voteType);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return '✅';
      case 'in-progress': return '⏳';
      case 'failed': return '❌';
      default: return '📋';
    }
  };

  const getVoteColor = (vote) => {
    switch (vote) {
      case 'yea': return '#28a745';
      case 'nay': return '#dc3545';
      case 'abstain': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s ease',
      marginBottom: '1rem'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#333',
            fontSize: '1.1rem',
            lineHeight: '1.3'
          }}>
            {motion.title}
          </h4>
          <p style={{ 
            color: '#666', 
            margin: '0 0 0.5rem 0',
            fontSize: '0.95rem',
            lineHeight: '1.4'
          }}>
            {motion.simplifiedDescription || motion.description}
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginLeft: '1rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>
            {getStatusIcon(motion.status)}
          </span>
          <span style={{ 
            color: getStatusColor(motion.status),
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            {motion.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Motion Details */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <strong style={{ color: '#333' }}>Date:</strong> {new Date(motion.date).toLocaleDateString()}
        </div>
        {motion.status === 'passed' && (
          <div>
            <button
              onClick={() => setShowMPVotes(!showMPVotes)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
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
              {showMPVotes ? 'Hide' : 'Show'} MP Vote Results ({motion.votes.yea + motion.votes.nay + motion.votes.abstain} total votes)
            </button>
          </div>
        )}
      </div>

      {/* MP Voting Records */}
      {motion.mpVotes && motion.mpVotes.length > 0 && showMPVotes && (
        <div style={{ marginBottom: '1rem' }}>
          <h5 style={{ margin: '0 0 0.75rem 0', color: '#333', fontSize: '1rem' }}>
            MP Voting Records:
          </h5>
          <div style={{ 
            display: 'grid', 
            gap: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '0.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            {motion.mpVotes.map((mp, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div>
                  <strong style={{ color: '#333' }}>{mp.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {mp.party} • {mp.riding}
                  </div>
                </div>
                <span style={{ 
                  color: getVoteColor(mp.vote),
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase'
                }}>
                  {mp.vote === 'yea' ? '✓ Yes' : mp.vote === 'nay' ? '✗ No' : '○ Abstain'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Voting Section */}
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
          <strong style={{ color: '#333', marginRight: '1rem' }}>Community Response:</strong>
          {userVote ? (
            <>
              <span style={{ color: '#28a745', marginRight: '1rem' }}>
                👍 {motion.userVotes.upvotes}
              </span>
              <span style={{ color: '#dc3545' }}>
                👎 {motion.userVotes.downvotes}
              </span>
            </>
          ) : (
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Vote to see community response
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleVote('upvote')}
            style={{
              padding: '6px 12px',
              backgroundColor: userVote === 'upvote' ? '#28a745' : '#ffffff',
              color: userVote === 'upvote' ? '#ffffff' : '#28a745',
              border: '2px solid #28a745',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (userVote !== 'upvote') {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (userVote !== 'upvote') {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#28a745';
              }
            }}
          >
            👍 Upvote
          </button>
          <button
            onClick={() => handleVote('downvote')}
            style={{
              padding: '6px 12px',
              backgroundColor: userVote === 'downvote' ? '#dc3545' : '#ffffff',
              color: userVote === 'downvote' ? '#ffffff' : '#dc3545',
              border: '2px solid #dc3545',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (userVote !== 'downvote') {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (userVote !== 'downvote') {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#dc3545';
              }
            }}
          >
            👎 Downvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotionCard;
