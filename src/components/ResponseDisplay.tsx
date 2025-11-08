import React, { useEffect, useState } from 'react';
import './ResponseDisplay.css';

interface ResponseDisplayProps {
  text: string;
  isVisible: boolean;
  isProcessing: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  text,
  isVisible,
  isProcessing,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (!isVisible || !text) {
      setDisplayText('');
      setCharIndex(0);
      return;
    }

    if (charIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 15); // Typewriter speed

      return () => clearTimeout(timer);
    }
  }, [charIndex, isVisible, text]);

  if (!isVisible && !isProcessing) {
    return null;
  }

  return (
    <div className={`response-display ${isProcessing ? 'processing' : ''}`}>
      <div className="response-header">
        <span className="response-label">COMPUTER RESPONSE:</span>
        <div className="response-indicator">
          {isProcessing && <div className="processing-dot" />}
        </div>
      </div>

      <div className="response-content">
        <p className="response-text">
          {displayText}
          {isProcessing || charIndex < text.length ? (
            <span className="cursor">▮</span>
          ) : null}
        </p>
      </div>

      {!isProcessing && text && (
        <div className="response-footer">
          <span className="response-status">Complete</span>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
