import React, { useState, useEffect, useCallback } from 'react';
import MotionCard from './MotionCard';
import CategoryFilter from './CategoryFilter';

const MotionDashboard = () => {
  const [motions, setMotions] = useState([]);
  const [filteredMotions, setFilteredMotions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI-generated categories for filtering motions
  const categories = [
    { id: 'all', name: 'All Motions', color: '#6c757d' },
    { id: 'womens-rights', name: "Women's Rights", color: '#e91e63' },
    { id: 'environmental', name: 'Environmental', color: '#4caf50' },
    { id: 'healthcare', name: 'Healthcare', color: '#2196f3' },
    { id: 'economy', name: 'Economy', color: '#ff9800' },
    { id: 'education', name: 'Education', color: '#9c27b0' },
    { id: 'immigration', name: 'Immigration', color: '#607d8b' },
    { id: 'indigenous', name: 'Indigenous Rights', color: '#795548' },
    { id: 'defense', name: 'Defense & Security', color: '#f44336' },
    { id: 'technology', name: 'Technology & Innovation', color: '#00bcd4' }
  ];

  const fetchMotions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/motions');
      if (!response.ok) {
        throw new Error('Failed to fetch motions');
      }
      const data = await response.json();
      setMotions(data.motions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching motions:', err);
      // Fallback to mock data for development
      setMotions(getMockMotions());
    } finally {
      setLoading(false);
    }
  }, []);

  const filterMotions = useCallback(() => {
    if (selectedCategory === 'all') {
      setFilteredMotions(motions);
    } else {
      const filtered = motions.filter(motion => 
        motion.categories && motion.categories.includes(selectedCategory)
      );
      setFilteredMotions(filtered);
    }
  }, [motions, selectedCategory]);

  useEffect(() => {
    fetchMotions();
  }, [fetchMotions]);

  useEffect(() => {
    filterMotions();
  }, [filterMotions]);

  const getMockMotions = () => {
    return [
      {
        id: 1,
        title: "Motion to Support Women's Economic Empowerment",
        description: "A motion to implement policies that support women's participation in the economy and address gender pay gaps.",
        status: "passed",
        date: "2024-01-15",
        categories: ["womens-rights", "economy"],
        votes: {
          yea: 245,
          nay: 78,
          abstain: 5
        },
        mpVotes: [
          { name: "Jane Smith", party: "Liberal", vote: "yea", riding: "Toronto Centre" },
          { name: "John Doe", party: "Conservative", vote: "nay", riding: "Calgary Centre" },
          { name: "Sarah Johnson", party: "NDP", vote: "yea", riding: "Vancouver East" }
        ],
        userVotes: { upvotes: 1247, downvotes: 89 }
      },
      {
        id: 2,
        title: "Climate Action and Environmental Protection Act",
        description: "Comprehensive legislation to address climate change and protect Canada's natural environment.",
        status: "in-progress",
        date: "2024-01-20",
        categories: ["environmental"],
        votes: {
          yea: 0,
          nay: 0,
          abstain: 0
        },
        mpVotes: [],
        userVotes: { upvotes: 2156, downvotes: 234 }
      },
      {
        id: 3,
        title: "Universal Healthcare Expansion",
        description: "Motion to expand healthcare coverage to include dental and mental health services.",
        status: "passed",
        date: "2024-01-10",
        categories: ["healthcare"],
        votes: {
          yea: 198,
          nay: 125,
          abstain: 5
        },
        mpVotes: [
          { name: "Dr. Michael Chen", party: "Liberal", vote: "yea", riding: "Richmond Hill" },
          { name: "Lisa Brown", party: "Conservative", vote: "nay", riding: "Calgary Nose Hill" },
          { name: "Tom Wilson", party: "NDP", vote: "yea", riding: "Hamilton Centre" }
        ],
        userVotes: { upvotes: 3456, downvotes: 456 }
      },
      {
        id: 4,
        title: "Indigenous Rights and Reconciliation Framework",
        description: "Framework to advance reconciliation and protect indigenous rights and territories.",
        status: "in-progress",
        date: "2024-01-25",
        categories: ["indigenous"],
        votes: {
          yea: 0,
          nay: 0,
          abstain: 0
        },
        mpVotes: [],
        userVotes: { upvotes: 1890, downvotes: 123 }
      },
      {
        id: 5,
        title: "Digital Privacy and Data Protection Act",
        description: "Legislation to strengthen digital privacy rights and data protection for Canadians.",
        status: "passed",
        date: "2024-01-05",
        categories: ["technology"],
        votes: {
          yea: 267,
          nay: 56,
          abstain: 5
        },
        mpVotes: [
          { name: "Alex Rodriguez", party: "Liberal", vote: "yea", riding: "Mississauga Centre" },
          { name: "Jennifer Lee", party: "Conservative", vote: "yea", riding: "Ottawa West" },
          { name: "David Kim", party: "NDP", vote: "yea", riding: "Burnaby South" }
        ],
        userVotes: { upvotes: 2789, downvotes: 167 }
      }
    ];
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleVote = async (motionId, voteType) => {
    try {
      const response = await fetch(`http://localhost:5001/api/motions/${motionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        // Update local state
        setMotions(prevMotions => 
          prevMotions.map(motion => 
            motion.id === motionId 
              ? {
                  ...motion,
                  userVotes: {
                    ...motion.userVotes,
                    [voteType]: motion.userVotes[voteType] + 1
                  }
                }
              : motion
          )
        );
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const recentMotions = filteredMotions.filter(motion => motion.status === 'passed');
  const inProgressMotions = filteredMotions.filter(motion => motion.status === 'in-progress');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading parliamentary motions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <div>Error loading motions: {error}</div>
        <button 
          onClick={fetchMotions}
          style={{ marginTop: '1rem', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Parliamentary Motions Dashboard</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Track recent parliamentary motions, see how MPs voted, and express your opinion on important issues.
        </p>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Recent Motions Passed */}
        <div>
          <h3 style={{ color: '#28a745', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>✅</span>
            Recent Motions Passed ({recentMotions.length})
          </h3>
          {recentMotions.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recentMotions.map(motion => (
                <MotionCard 
                  key={motion.id} 
                  motion={motion} 
                  onVote={handleVote}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              No recent motions passed in this category.
            </div>
          )}
        </div>

        {/* Motions in Progress */}
        <div>
          <h3 style={{ color: '#ffc107', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>⏳</span>
            Motions in Progress ({inProgressMotions.length})
          </h3>
          {inProgressMotions.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {inProgressMotions.map(motion => (
                <MotionCard 
                  key={motion.id} 
                  motion={motion} 
                  onVote={handleVote}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              No motions currently in progress in this category.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MotionDashboard;
