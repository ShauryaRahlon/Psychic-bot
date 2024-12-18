import { useState } from 'react';

import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

// const api_key = import.meta.env.VITE_GROQ_API_KEY;

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Initialize Google Generative AI
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Use environment variable for API key
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Generate AI content
      const aiResponse = await model.generateContent(query);

      // Set the AI response to result
      setResult(aiResponse.response.text());
    } catch (err) {
      setError('An error occurred while generating AI content.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">AI Search Assistant</h1>

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="What would you like to know?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`search-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="results-section">
            <h2 className="results-title">Results</h2>
            <div className="results-container">
              <pre className="json-result">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

