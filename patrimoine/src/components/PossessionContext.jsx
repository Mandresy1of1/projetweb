import React, { createContext, useState, useEffect } from 'react';

const PossessionContext = createContext();

export function PossessionProvider({ children }) {
  const [possessions, setPossessions] = useState([]);

  const fetchPossessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/possession');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPossessions(data.possessions);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPossessions();
  }, []);

  return (
    <PossessionContext.Provider value={{ possessions, fetchPossessions }}>
      {children}
    </PossessionContext.Provider>
  );
}

export default PossessionContext;
