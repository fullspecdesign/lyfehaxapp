import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function SavedLifehacks({ savedLifehacks, onRemove }) {
  const generateSocialLink = (platform, item) => {
    const message = `Problem: ${item.query}\nHack: ${item.hack}`;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(message);

    if (platform === 'twitter') {
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'facebook') {
      return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    } else if (platform === 'linkedin') {
      return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Lifehack&summary=${text}`;
    }
  };

  return (
    <div className="saved-lifehacks-container">
      <h2>Saved Lifehacks</h2>
      {savedLifehacks.length > 0 ? (
        <div className="saved-lifehacks-list">
          {savedLifehacks.map((item, index) => (
            <div key={index} className="saved-lifehack-card">
              <div className="lifehack-content">
                <p><strong>Problem:</strong> {item.query}</p>
                <p><strong>Hack:</strong> {item.hack}</p>
              </div>
              <div className="action-buttons">
                <button className="remove-button" onClick={() => onRemove(item)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Remove
                </button>
                <a
                  href={generateSocialLink('twitter', item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button twitter"
                >
                  <FontAwesomeIcon icon={faTwitter} /> Twitter
                </a>
                <a
                  href={generateSocialLink('facebook', item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} /> Facebook
                </a>
                <a
                  href={generateSocialLink('linkedin', item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button linkedin"
                >
                  <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved lifehacks yet. Start saving your favorites!</p>
      )}
    </div>
  );
}

export default SavedLifehacks;