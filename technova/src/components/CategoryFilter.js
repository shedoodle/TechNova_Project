import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h4 style={{ marginBottom: '1rem', color: '#333' }}>Filter by Category:</h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === category.id ? category.color : '#ffffff',
              color: selectedCategory === category.id ? '#ffffff' : '#333',
              border: `2px solid ${category.color}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === category.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category.id) {
                e.target.style.backgroundColor = category.color;
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category.id) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.color = '#333';
              }
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
