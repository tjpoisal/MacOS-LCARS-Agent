# LCARS Agent - Architecture Guide

## System Overview

LCARS Agent is a sophisticated, agentic intelligent assistant for macOS that combines:

- **Enterprise-D Computer Interface**: Iconic LCARS (Library Computer Access and Retrieval System) design
- **Agentic AI**: Claude-powered autonomous task execution
- **Voice Control**: Natural language voice input and LCARS voice output
- **macOS Integration**: Native hotkeys and system integration

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Electron Main Process                         │
│  - Global Hotkeys (Cmd+Space)                                   │
│  - Window Management                                             │
│  - Python Backend Lifecycle                                      │
└─────────────────────────────────────────────────────────────────┘
              ↓ IPC & WebSocket            ↓
┌─────────────────────────────────────┐  ┌──────────────────────────┐
│     React Frontend (LCARS UI)       │  │  Python Backend (Flask)  │
│                                      │  │                          │
│ - Voice Input Recognition           │  │ - Agent Processing       │
│ - Response Display (Typewriter)     │  │ - Task Execution         │
│ - LCARS Interface Components        │  │ - Voice Synthesis        │
│ - State Management                  │  │ - System Integration     │
│                                      │  │                          │
│ Technologies:                       │  │ Technologies:            │
│ - TypeScript/React                  │  │ - Python 3.9+            │
│ - Socket.IO Client                  │  │ - Flask                  │
│ - Web Speech API                    │  │ - Anthropic Claude API   │
│ - Web Audio API                     │  │ - pyttsx3                │
└─────────────────────────────────────┘  └──────────────────────────┘
         ↓ UI/UX Events                           ↓ API Requests
┌─────────────────────────────────────────────────────────────────┐
│                      macOS System APIs                           │
│  - Speech Recognition                                            │
│  - Text-to-Speech                                               │
│  - Accessibility Features                                        │
│  - Process Management                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (Electron + React)

#### Directory Structure
```
src/
├── components/
│   ├── LCARSInterface.tsx       # Main LCARS frame & styling
│   ├── VoiceInput.tsx           # Voice recognition UI & controls
│   └── ResponseDisplay.tsx      # Response rendering with typewriter effect
├── services/
│   └── BackendService.ts        # Communication with Python backend
├── App.tsx                      # Main application component
└── index.tsx                    # React entry point
```

#### Key Components

**LCARSInterface**
- Renders the iconic LCARS frame with orange borders
- Status indicators (online/offline/processing)
- Top and bottom bars with system information
- Decorative corner elements

**VoiceInput**
- Microphone button with pulse animations
- Speech recognition using Web Speech API
- Text input fallback
- Voice status display
- Real-time transcript display

**ResponseDisplay**
- Typewriter effect for response text
- Processing indicator
- LCARS-styled panel with header/footer
- Automatic scrolling for long responses

**BackendService**
- Socket.IO client for real-time communication
- REST API client for health checks
- Event handlers for voice/text responses
- Automatic reconnection handling

### Backend (Flask + Claude)

#### Directory Structure
```
backend/
├── lcars_agent/
│   ├── __init__.py              # Package initialization
│   ├── app.py                   # Flask app & main entry point
│   ├── agent.py                 # Agentic logic (Claude integration)
│   ├── voice.py                 # Voice synthesis & recognition
│   └── utils.py                 # Logging & utilities
└── requirements.txt             # Python dependencies
```

#### Key Modules

**agent.py (LCARSAgent)**
- Claude API integration with agentic loop
- Conversation history management
- Action parsing and execution
- System command execution
- Intelligent task breakdown

**voice.py (VoiceManager)**
- Text-to-speech synthesis using pyttsx3
- Voice configuration (speed, pitch, volume)
- LCARS voice formatting
- Speech recognition integration
- Audio file generation and encoding

**app.py (Flask Application)**
- REST API endpoints
- Socket.IO event handlers
- Request/response management
- Error handling and logging
- Service initialization

## Data Flow

### Voice Input Flow
```
1. User presses Cmd+Space or clicks microphone
2. React component starts Web Speech API
3. User speaks query
4. Browser transcribes to text
5. React sends 'voice-input' via Socket.IO
6. Backend receives and processes with Claude
7. Claude generates response
8. Backend synthesizes speech (pyttsx3)
9. Backend sends response + audio to frontend
10. Frontend displays text (with typewriter effect)
11. Frontend plays audio (LCARS voice)
```

### Text Query Flow
```
1. User types query and presses Enter
2. React sends 'text-query' via Socket.IO
3. Backend receives and processes with Claude
4. Claude generates response
5. Backend synthesizes speech
6. Backend sends response + audio to frontend
7. Frontend displays and plays response
```

### Task Execution Flow
```
1. Claude determines action is needed [ACTION: type content]
2. Agent parses action from response
3. Agent executes action (open app, run command, etc.)
4. Agent captures result
5. Agent includes feedback in conversation
6. Claude generates refined response based on feedback
7. Agent continues agentic loop until task complete
```

## Technologies

### Frontend Stack
- **Electron**: Native macOS desktop app
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Socket.IO**: Real-time bidirectional communication
- **Web Speech API**: Speech recognition
- **Web Audio API**: Audio playback

### Backend Stack
- **Python 3.9+**: Programming language
- **Flask**: Web framework
- **Flask-SocketIO**: WebSocket support
- **Anthropic Claude API**: AI/Agent backbone
- **pyttsx3**: Text-to-speech
- **python-dotenv**: Environment configuration

### External Services
- **Anthropic Claude API**: AI processing and agentic loop
- **macOS Speech APIs**: Native voice capabilities

## Security Considerations

### API Key Management
- API keys stored in `.env` (not committed to git)
- Environment variables used for configuration
- Sensitive data not logged

### Voice Data
- Audio processed locally when possible
- No voice data stored unless explicitly saved
- HTTPS/WSS for all API communications

### System Commands
- Command execution limited and logged
- User approval for privileged operations
- Sandboxed execution context

## Performance Optimization

### Frontend
- Component memoization for expensive re-renders
- Lazy loading of components
- Optimized CSS animations using GPU acceleration
- Efficient socket event handlers

### Backend
- Conversation history limited to prevent token bloat
- Concurrent request handling
- Response streaming for large outputs
- Caching of synthesis results

## Extensibility

### Adding New Commands
Add to `LCARSAgent.process()` and action parsing:
```python
elif action_type == "NEW_COMMAND":
    result = self._execute_new_command(action_content)
```

### Custom Voice Effects
Modify `voice.py` to add audio processing:
```python
def synthesize_with_effects(self, text: str) -> str:
    # Add custom audio effects here
```

### UI Customization
Edit LCARS colors in `App.css`:
```css
--lcars-blue: #0033ff;
--lcars-orange: #ff6600;
```

## Deployment

### Development
```bash
npm run dev  # Runs both frontend and backend
```

### Production
```bash
npm run build    # Builds React app
npm run dist     # Creates .dmg for distribution
```

### macOS App Store
Can be distributed via App Store with proper signing and notarization.

## Logging & Debugging

### Log Locations
- Frontend: Browser DevTools console
- Backend: `~/.lcars/logs/lcars_agent.log`
- System: macOS Console app

### Debug Mode
Enable in `.env`:
```
DEBUG=True
```

This enables verbose logging and shows console output.

## Future Enhancements

1. **Multi-language Support**: Support for different LCARS voices
2. **Machine Learning**: Custom voice training
3. **Plugin System**: Third-party integrations
4. **Advanced Task Automation**: Workflow builder
5. **Voice Profiles**: Accent and speech pattern customization
6. **Advanced Reasoning**: Extended thinking capabilities
7. **Visual Query Builder**: GUI for complex tasks
8. **Integration Marketplace**: Community plugins

## Performance Metrics

### Target Metrics
- Voice recognition latency: < 2 seconds
- Response generation: < 5 seconds
- UI response time: < 100ms
- Memory usage: < 500MB
- Startup time: < 3 seconds

### Monitoring
Monitor performance using:
- Chrome DevTools Performance tab (frontend)
- Python cProfile (backend)
- macOS Activity Monitor

---

For more information, see:
- [Installation Guide](INSTALLATION.md)
- [README](README.md)
