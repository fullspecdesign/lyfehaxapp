function Results({ results, onSave, query }) {
  const handleShare = (hack) => {
    const shareData = {
      title: 'Lifehack',
      text: `Problem: ${query}\nHack: ${hack}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareData.text).then(() => {
        alert('Lifehack copied to clipboard!');
      });
    }
  };

  return (
    <div className="results-container">
      {results.length > 0 ? (
        <ol>
          {results.map((result, index) => (
            <li key={index} className="result-card">
              <p>{result}</p>
              <div className="action-buttons">
                <button className="save-button" onClick={() => onSave(result, query)}>
                  Save
                </button>
                <button className="share-button" onClick={() => handleShare(result)}>
                  Share
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="no-results-message">Enter a problem to get lifehack suggestions!</p>
      )}
    </div>
  );
}

export default Results;