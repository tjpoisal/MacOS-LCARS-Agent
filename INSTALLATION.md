# LCARS Agent - Installation Guide

## Prerequisites

Before installing LCARS Agent, ensure you have the following:

- **macOS 11.0 or later**
- **Xcode Command Line Tools**
  ```bash
  xcode-select --install
  ```
- **Homebrew** (optional but recommended)
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- **Node.js 16+**
  ```bash
  # Using Homebrew
  brew install node

  # Or download from https://nodejs.org/
  ```
- **Python 3.9+**
  ```bash
  # Using Homebrew
  brew install python3

  # Or download from https://www.python.org/
  ```
- **Claude API Key**
  - Get your API key from https://console.anthropic.com
  - Create an account and generate an API key

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MacOS-LCARS-Agent
```

### 2. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Claude API key
# Use your favorite editor (nano, vim, VS Code, etc.)
nano .env
```

Add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
# Create a Python virtual environment (recommended)
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 5. Verify Installation

```bash
# Check Node.js
node --version  # Should be v16 or higher

# Check npm
npm --version   # Should be 7 or higher

# Check Python
python3 --version  # Should be 3.9 or higher

# Check pip packages
pip list | grep -E "anthropic|flask|pyttsx3"
```

## Running the Application

### Development Mode

Open two terminal windows/tabs:

**Terminal 1 - Frontend & Electron:**
```bash
npm run dev
```

**Terminal 2 - Backend (from project root):**
```bash
source venv/bin/activate
python -m lcars_agent.app
```

The application will:
1. Start the React development server on `http://localhost:3000`
2. Launch the Electron app
3. Start the Python backend on `http://localhost:5000`

### Production Build

```bash
# Build the application
npm run build

# Create distributable for macOS
npm run dist
```

The `.dmg` file will be created in the `dist/` directory.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Space` | Activate voice input |
| `Cmd+Shift+Escape` | Close/Minimize application |
| `Cmd+Q` | Quit application |

## First Run Configuration

### macOS Permissions

LCARS Agent requires the following permissions:

1. **Microphone Access**
   - System Preferences → Security & Privacy → Microphone
   - Add LCARS Agent to the allowed list

2. **Accessibility**
   - System Preferences → Security & Privacy → Accessibility
   - Add LCARS Agent to the allowed list (for hotkey detection)

### Testing the Setup

1. Launch LCARS Agent
2. You should see the LCARS interface
3. Click the microphone button or press `Cmd+Space`
4. Say "Hello" or "What is your status?"
5. The computer should respond in voice

## Troubleshooting

### Backend Connection Error

**Error:** "Backend service unavailable"

**Solution:**
```bash
# Ensure the backend is running
source venv/bin/activate
python -m lcars_agent.app

# Check if port 5000 is available
lsof -i :5000

# If port is in use, kill the process
kill -9 <PID>
```

### Microphone Not Working

1. Check System Preferences → Security & Privacy → Microphone
2. Ensure LCARS Agent has microphone access
3. Test microphone with other apps first
4. Try restarting the application

### Voice Synthesis Issues

```bash
# Test speech synthesis
python3 -c "import pyttsx3; pyttsx3.init().say('Testing voice'); pyttsx3.init().runAndWait()"
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## Updating

```bash
# Update frontend dependencies
npm update

# Update backend dependencies
source venv/bin/activate
pip install --upgrade -r requirements.txt
```

## Uninstallation

To completely remove LCARS Agent:

```bash
# Remove the application
rm -rf /Applications/LCARS\ Agent.app

# Remove configuration files
rm -rf ~/.lcars

# Remove local files
rm -rf ~/path/to/MacOS-LCARS-Agent
```

## Support

For issues and feature requests, please visit the GitHub repository issues page.

## Development Tips

### Hot Reloading

The development mode supports hot reloading:
- Frontend changes reload automatically in the Electron window
- Backend changes require manual restart

### Debugging

**Frontend Debugging:**
- DevTools available in development mode (F12)
- React Developer Tools browser extension recommended

**Backend Debugging:**
- Check logs: `~/.lcars/logs/lcars_agent.log`
- Enable debug mode in `.env`: `DEBUG=True`

### Testing Voice Locally

```bash
# Test the backend API
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello computer"}'
```

## Next Steps

1. Customize LCARS colors in `src/App.css`
2. Add custom voice profiles in `backend/lcars_agent/voice.py`
3. Implement additional task commands in `backend/lcars_agent/agent.py`
4. Create custom voice effects and audio processing

Enjoy your Enterprise-D computer experience!
