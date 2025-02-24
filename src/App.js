import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Results from "./Results";
import SavedLifehacks from "./SavedLifehacks";
import ReactGA from "react-ga4";

function App() {
  const [results, setResults] = useState([]);
  const [savedLifehacks, setSavedLifehacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Predefined categories
  const categories = ["Household", "Cooking", "Productivity", "Fitness", "DIY"];

  // Load saved lifehacks from localStorage on initial render
  useEffect(() => {
    const storedLifehacks = localStorage.getItem("savedLifehacks");
    if (storedLifehacks) {
      setSavedLifehacks(JSON.parse(storedLifehacks));
    }
    ReactGA.initialize("G-NHFP97RWWK"); // Replace with your Measurement ID
    ReactGA.send("pageview"); // Tracks page visits
  }, []);

  const fetchLifehacks = async (query) => {
    setLoading(true);
    setError("");

    try {
      // Call the Netlify Function instead of OpenAI directly
      const response = await axios.post("/.netlify/functions/fetchLifehacks", {
        query,
      });

      if (response.data.lifehacks) {
        setResults(response.data.lifehacks);
      }
    } catch (error) {
      console.error("Error fetching lifehacks:", error);
      setError(
        "Failed to fetch lifehacks. Please check your connection and try again."
      );
    }

    setLoading(false);
  };

  // Handle search queries
  const handleSearch = (query) => {
    setCurrentQuery(query);
    fetchLifehacks(query);
  };

  // Handle category clicks
  const handleCategoryClick = (category) => {
    setCurrentQuery(category);
    fetchLifehacks(`Give me 3 lifehacks for ${category}.`);
  };

  // Save a lifehack
  const saveLifehack = (hack, query) => {
    const newLifehack = { query, hack };
    const isDuplicate = savedLifehacks.some(
      (item) => item.hack === hack && item.query === query
    );
    if (!isDuplicate) {
      const updatedSavedLifehacks = [...savedLifehacks, newLifehack];
      setSavedLifehacks(updatedSavedLifehacks);
      localStorage.setItem(
        "savedLifehacks",
        JSON.stringify(updatedSavedLifehacks)
      );
    } else {
      alert("This lifehack is already saved!");
    }
  };

  // Remove a saved lifehack
  const removeLifehack = (lifehackToRemove) => {
    const updatedSavedLifehacks = savedLifehacks.filter(
      (item) =>
        item.hack !== lifehackToRemove.hack ||
        item.query !== lifehackToRemove.query
    );
    setSavedLifehacks(updatedSavedLifehacks);
    localStorage.setItem(
      "savedLifehacks",
      JSON.stringify(updatedSavedLifehacks)
    );
  };

  return (
    <div className="App">
      <header>
        <div className="header-content">
          <h1>LyfeHax</h1>
          <p className="tagline">AI-powered life hacks for everyday problems</p>
        </div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        <div className="categories">
          {categories.map((category, index) => (
            <button key={index} onClick={() => handleCategoryClick(category)}>
              {category}
            </button>
          ))}
        </div>
        <p className="category-hint">
          Click a category above to get random lifehacks!
        </p>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <Results
            results={results}
            onSave={saveLifehack}
            query={currentQuery}
          />
        )}
        {error && <p className="error">{error}</p>}
        <SavedLifehacks
          savedLifehacks={savedLifehacks}
          onRemove={removeLifehack}
        />
      </main>
      <footer>
        <p>&copy; 2025. Developed by Clendon Biscette.</p>
      </footer>
    </div>
  );
}

export default App;
