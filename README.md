# macOS LCARS Agent

A sophisticated, agentic intelligent assistant for macOS that replaces Siri with the iconic **LCARS** (Library Computer Access and Retrieval System) interface and voice from Star Trek: Picard Season 3.

Featuring the modern, refined LCARS aesthetic from the latest Star Trek series with contemporary styling, subtle cyan accents, and elegant gold highlights.

## 🖥️ Features

- **Picard Season 3 LCARS Interface**: Modern, refined LCARS design with sophisticated color palette (cyan accents, gold highlights, dark blue panels)
- **Agentic AI**: Claude-powered autonomous task execution and decision-making
- **Voice Control**: Natural language voice input with real-time transcription
- **LCARS Voice**: Responses in the iconic LCARS computer voice (pyttsx3 synthesis)
- **Hotkey Activation**: Press `Cmd+Space` to activate voice input anywhere
- **Task Execution**: Run scripts, open applications, control system settings
- **Real-time Communication**: WebSocket-based frontend-backend communication
- **Intelligent Responses**: Multi-turn conversations with context awareness
- **macOS Integration**: Native app integration, system command execution
- **Typewriter Effect**: Responses display with authentic computer text effect

## 🏗️ Architecture

This is a sophisticated, multi-layered system:

```
┌─────────────────────────────────┐
│   Electron (macOS Native App)   │
│     + Global Hotkeys            │
├─────────────────────────────────┤
│   React Frontend (LCARS UI)     │
│   - Voice Input (Web Speech API)│
│   - Response Display            │
│   - LCARS Interface Components  │
├─────────────────────────────────┤
│  WebSocket (Socket.IO)          │
│      Real-time Communication    │
├─────────────────────────────────┤
│   Python Backend (Flask)        │
│   - Claude API Integration      │
│   - Agentic Loop & Task Exec    │
│   - Voice Synthesis (pyttsx3)   │
├─────────────────────────────────┤
│   macOS System APIs             │
│   - Speech Recognition          │
│   - Text-to-Speech              │
│   - System Commands             │
└─────────────────────────────────┘
```

## 📋 Requirements

- **macOS 11.0 or later**
- **Node.js 16+** (for frontend)
- **Python 3.9+** (for backend)
- **Claude API Key** (from https://console.anthropic.com)

### Optional

- **Homebrew** (for easy installation of dependencies)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd MacOS-LCARS-Agent
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env and add your Claude API key
nano .env
```

### 3. Install Dependencies
```bash
npm install

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Run Application
```bash
# Terminal 1
npm run dev

# Terminal 2 (in same directory)
source venv/bin/activate
python -m lcars_agent.app
```

The LCARS interface will launch! Try saying "Hello" or "What's your status?"

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Space` | Activate voice input |
| `Cmd+Shift+Escape` | Minimize window |
| `Cmd+Q` | Quit application |
| `F12` | Open developer tools |

## 💬 Usage Examples

### Voice Commands
- "What is your status?"
- "Open Finder"
- "Can you help me with a task?"
- "Tell me about the Enterprise"
- "Run a system command"

### Text Input
- Click the microphone button to disable voice
- Type queries in the text input field
- Press Enter to send

## 📚 Documentation

- **[Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[Architecture Guide](ARCHITECTURE.md)** - System design and component details
- **[Development Guide](DEVELOPMENT.md)** - Contributing and development workflow

## 🔧 Development

### Development Mode
```bash
npm run dev
```

Runs both the React frontend and Electron app with hot reloading.

### Backend Only
```bash
source venv/bin/activate
python -m lcars_agent.app
```

### Building for Production
```bash
npm run build
npm run dist
```

Creates a macOS `.dmg` file in the `dist/` directory.

## 🤖 How the Agent Works

1. **Listen**: User speaks or types a query
2. **Transcribe**: Speech-to-text conversion
3. **Process**: Claude API analyzes the query
4. **Act**: Agent executes necessary actions ([ACTION: ...])
5. **Respond**: Generates response and synthesizes voice
6. **Loop**: Continues conversation with context awareness

### Agentic Capabilities

The agent can:
- Open applications
- Run system commands
- Execute scripts
- Control system settings
- Make multi-step decisions
- Remember conversation context
- Execute complex task workflows

## 🎨 Picard Season 3 LCARS Design

The interface features the modern LCARS aesthetic from Star Trek: Picard Season 3:

- **Color Scheme** (Contemporary & Sophisticated):
  - Primary Blue: `#1a4d7a` - Deep, professional blue panels
  - Secondary Blue: `#2a6fa6` - Lighter blue accents
  - Cyan Accents: `#00d9ff` - Modern cyan borders and highlights
  - Gold Accents: `#d4af37` - Elegant gold buttons and labels
  - Amber: `#ff8c00` - Warm highlights
  - Background: `#0a0e1a` - Deep space black
  - Surface: `#131824` - Subtle surface color

- **UI Elements**:
  - Subtle glowing indicators with reduced intensity
  - Refined gradient buttons
  - Backdrop blur effects for depth
  - Minimalist decorative corners
  - Monospace Courier New typography
  - Typewriter text effect with cyan cursor

- **Animations**:
  - Smooth pulse rings (cyan for listening)
  - Processing spinner with gold accents
  - Elegant text cursor blink
  - Refined transitions (0.2s ease)
  - Subtle glow effects instead of harsh shadows

## 🔐 Security

- API keys stored in `.env` (not committed)
- No voice data stored without permission
- System commands logged and auditable
- Secure WebSocket communication
- Context-isolated Electron preload

## 📊 Performance

Target metrics:
- Voice recognition: < 2 seconds
- Response generation: < 5 seconds
- UI response time: < 100ms
- Memory usage: < 500MB
- Startup time: < 3 seconds

## 🐛 Troubleshooting

**Backend won't connect?**
```bash
# Ensure backend is running on port 5000
lsof -i :5000
```

**Microphone not working?**
- Check System Preferences → Security & Privacy → Microphone
- Ensure LCARS Agent has microphone access

**Voice synthesis not working?**
```bash
# Test voice synthesis
python3 -c "import pyttsx3; pyttsx3.init().say('Test'); pyttsx3.init().runAndWait()"
```

See [Installation Guide](INSTALLATION.md) for more troubleshooting.

## 🚀 Future Enhancements

- [ ] Multi-language voice support
- [ ] Custom voice training
- [ ] Plugin system for extensions
- [ ] Advanced workflow builder
- [ ] Speech pattern customization
- [ ] Cloud synchronization
- [ ] Mobile companion app

## 📝 License

[Add your license here]

## 👥 Contributing

Contributions are welcome! See [Development Guide](DEVELOPMENT.md) for contribution guidelines.

## 📞 Support

- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share ideas
- Check logs: `~/.lcars/logs/lcars_agent.log`

## 🎬 Credits

- **LCARS Design**: Star Trek: The Next Generation
- **AI**: Anthropic Claude
- **Voice**: pyttsx3 and macOS speech APIs
- **Frontend**: React and Electron
- **Backend**: Flask and Python

---

**Engage!** 🖖

Enjoy your Enterprise-D computer experience!
