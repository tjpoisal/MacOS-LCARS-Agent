import React, { useState, useEffect } from 'react';
import './App.css';
import LCARSInterface from './components/LCARSInterface';
import VoiceInput from './components/VoiceInput';
import ResponseDisplay from './components/ResponseDisplay';
import { BackendService } from './services/BackendService';

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [systemStatus, setSystemStatus] = useState('online');

  useEffect(() => {
    // Initialize backend connection
    BackendService.connect();

    // Check backend health
    checkBackendHealth();

    // Setup listeners
    window.electron?.onActivateVoice(() => {
      activateVoiceInput();
    });

    return () => {
      BackendService.disconnect();
    };
  }, []);

  const checkBackendHealth = async () => {
    try {
      const status = await BackendService.checkHealth();
      if (status.status === 'operational') {
        setSystemStatus('operational');
      }
    } catch (err) {
      setSystemStatus('offline');
      setError('Backend service unavailable');
    }
  };

  const handleVoiceInput = async (audioData: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await BackendService.processVoiceInput(audioData);

      setResponse(result.text);

      if (result.audio) {
        playAudio(result.audio);
      }

      if (result.actions && result.actions.length > 0) {
        handleActions(result.actions);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  const handleTextQuery = async (query: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await BackendService.processTextQuery(query);

      setResponse(result.text);

      if (result.audio) {
        playAudio(result.audio);
      }

      if (result.actions && result.actions.length > 0) {
        handleActions(result.actions);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const activateVoiceInput = () => {
    setIsListening(true);
    setResponse('');
    setError('');
  };

  const handleActions = (actions: any[]) => {
    // Log actions for now
    console.log('Executing actions:', actions);
  };

  const playAudio = (audioData: string) => {
    try {
      const audioBlob = base64ToBlob(audioData);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    } catch (err) {
      console.error('Error processing audio:', err);
    }
  };

  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'audio/wav' });
  };

  return (
    <div className="app">
      <LCARSInterface
        status={systemStatus}
        isProcessing={isProcessing}
        isListening={isListening}
      >
        <div className="main-content">
          <ResponseDisplay
            text={response}
            isVisible={!!response}
            isProcessing={isProcessing}
          />

          {error && <div className="error-display">{error}</div>}

          <VoiceInput
            isListening={isListening}
            isProcessing={isProcessing}
            onVoiceInput={handleVoiceInput}
            onTextQuery={handleTextQuery}
            onActivateVoice={activateVoiceInput}
          />
        </div>
      </LCARSInterface>
    </div>
  );
};

export default App;
