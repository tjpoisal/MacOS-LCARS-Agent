import React from 'react';
import './LCARSInterface.css';

interface LCARSInterfaceProps {
  status: 'online' | 'offline' | 'operational';
  isProcessing: boolean;
  isListening: boolean;
  children: React.ReactNode;
}

const LCARSInterface: React.FC<LCARSInterfaceProps> = ({
  status,
  isProcessing,
  isListening,
  children,
}) => {
  const getStatusColor = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return status === 'operational' ? 'online' : 'offline';
  };

  const getStatusText = () => {
    if (isListening) return 'LISTENING';
    if (isProcessing) return 'PROCESSING';
    return status === 'operational' ? 'ONLINE' : 'OFFLINE';
  };

  return (
    <div className="lcars-frame">
      {/* Top Bar */}
      <div className="lcars-top-bar">
        <div className="lcars-header">
          <span className="lcars-title">USS ENTERPRISE-D COMPUTER INTERFACE</span>
        </div>

        <div className="lcars-status-bar">
          <div className="status-item">
            <span
              className={`lcars-indicator ${getStatusColor()}`}
              title={getStatusText()}
            />
            <span className="status-text">{getStatusText()}</span>
          </div>

          <div className="status-item">
            <span className="lcars-label">SYSTEM:</span>
            <span className="lcars-value">OPERATIONAL</span>
          </div>

          <div className="status-item">
            <span className="lcars-label">VOICE:</span>
            <span className="lcars-value">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lcars-main-frame">{children}</div>

      {/* Bottom Bar */}
      <div className="lcars-bottom-bar">
        <div className="lcars-footer">
          <span className="lcars-info">LCARS v1.0 | macOS LCARS Agent</span>
          <span className="lcars-info">Say "Computer" to activate</span>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="lcars-corner lcars-corner-tl" />
      <div className="lcars-corner lcars-corner-tr" />
      <div className="lcars-corner lcars-corner-bl" />
      <div className="lcars-corner lcars-corner-br" />
    </div>
  );
};

export default LCARSInterface;
