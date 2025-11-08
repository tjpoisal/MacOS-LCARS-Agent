import React, { useState, useRef, useEffect } from 'react';
import './VoiceInput.css';

interface VoiceInputProps {
  isListening: boolean;
  isProcessing: boolean;
  onVoiceInput: (audioData: string) => void;
  onTextQuery: (query: string) => void;
  onActivateVoice: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  isProcessing,
  onVoiceInput,
  onTextQuery,
  onActivateVoice,
}) => {
  const [textInput, setTextInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            setTranscript(transcript);
            onVoiceInput(transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onVoiceInput]);

  // Start listening when isListening changes
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  }, [isListening]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (textInput.trim()) {
      onTextQuery(textInput);
      setTextInput('');
    }
  };

  const handleMicrophoneClick = () => {
    onActivateVoice();
  };

  return (
    <div className="voice-input-container">
      <div className="input-section">
        {/* Voice Activation Button */}
        <div className={`microphone-button ${isListening ? 'listening' : ''}`}>
          <button
            className={`mic-btn ${isListening ? 'active' : ''} ${
              isProcessing ? 'processing' : ''
            }`}
            onClick={handleMicrophoneClick}
            disabled={isProcessing}
            title="Click to start voice input (or press Cmd+Space)"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          {isListening && <div className="listening-pulse" />}
          {isProcessing && <div className="processing-spinner" />}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className={`transcript-display ${isListening ? 'listening' : ''}`}>
            <span className="transcript-label">Transcribing:</span>
            <span className="transcript-text">{transcript}</span>
          </div>
        )}

        {/* Text Input */}
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <input
            type="text"
            className="text-input"
            placeholder="Type your query here or use voice (Cmd+Space)..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isProcessing || !textInput.trim()}
            title="Send query"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {/* Voice Status Indicator */}
      <div className="voice-status">
        {isListening && <span className="status-badge listening">Listening...</span>}
        {isProcessing && <span className="status-badge processing">Processing...</span>}
        {!isListening && !isProcessing && (
          <span className="status-badge ready">Ready</span>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
