# LCARS Agent - Development Guide

## Getting Started with Development

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd MacOS-LCARS-Agent
   git checkout -b feature/your-feature-name
   ```

2. **Install Dependencies**
   ```bash
   npm install
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API key
   nano .env
   ```

## Development Workflow

### Running Development Servers

**Terminal 1 - Frontend + Electron:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
source venv/bin/activate
python -m lcars_agent.app
```

### Hot Reloading

- **Frontend**: Changes to React components automatically reload
- **Backend**: Changes require manual server restart
- **CSS**: Changes reload automatically in Electron dev mode

## Code Structure & Conventions

### TypeScript (Frontend)

- **File naming**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Props interfaces**: Named `ComponentNameProps`
- **Styling**: CSS modules or inline styles with CSS variables

Example:
```typescript
interface VoiceInputProps {
  isListening: boolean;
  onVoiceInput: (data: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isListening, onVoiceInput }) => {
  // Component code
};
```

### Python (Backend)

- **File naming**: `snake_case.py` for files
- **Class naming**: `PascalCase` (e.g., `LCARSAgent`)
- **Method naming**: `snake_case` (e.g., `process_query`)
- **Type hints**: Use for all functions

Example:
```python
def process(self, user_query: str) -> Dict[str, Any]:
    """Process a user query and return response with actions."""
    # Implementation
```

### CSS

- **Color variables**: Use CSS custom properties (defined in App.css)
- **Component styling**: One CSS file per component
- **Naming**: BEM convention for complex components

Example:
```css
.lcars-button {
  /* Base styles */
}

.lcars-button:hover {
  /* Hover state */
}

.lcars-button.active {
  /* Active state */
}
```

## Common Tasks

### Adding a New UI Component

1. **Create component file**
   ```typescript
   // src/components/MyComponent.tsx
   interface MyComponentProps {
     prop1: string;
     onAction: (value: string) => void;
   }

   const MyComponent: React.FC<MyComponentProps> = ({ prop1, onAction }) => {
     return <div>{prop1}</div>;
   };

   export default MyComponent;
   ```

2. **Create styles**
   ```css
   /* src/components/MyComponent.css */
   .my-component {
     /* LCARS styling */
   }
   ```

3. **Import and use**
   ```typescript
   import MyComponent from './components/MyComponent';
   ```

### Adding Backend API Endpoint

1. **Add route in app.py**
   ```python
   @app.route('/api/custom', methods=['POST'])
   def custom_endpoint():
       data = request.json
       # Process data
       return jsonify({'result': result}), 200
   ```

2. **Add Socket.IO handler**
   ```python
   @socketio.on('custom-event')
   def handle_custom_event(data):
       # Process event
       emit('response', {'result': result})
   ```

### Adding Agent Capability

1. **Update system prompt in agent.py**
   ```python
   self.system_prompt = """... Add capability description ..."""
   ```

2. **Add action handler**
   ```python
   elif action_type == "NEW_ACTION":
       result = self._execute_new_action(action_content)
   ```

3. **Test with voice or text input**

## Testing

### Frontend Testing

```bash
# Run React tests
npm test

# Build for testing
npm run react-build
```

### Backend Testing

```bash
source venv/bin/activate

# Run Python tests
python -m pytest

# Test individual module
python -m pytest backend/lcars_agent/agent.py -v
```

### Manual Testing Checklist

- [ ] Voice input captures speech correctly
- [ ] Response displays with typewriter effect
- [ ] LCARS voice speaks response
- [ ] Hotkey (Cmd+Space) activates voice
- [ ] Application window minimizes/maximizes
- [ ] Backend connection established
- [ ] Task execution works (if applicable)
- [ ] Error messages display properly
- [ ] UI animations are smooth

## Debugging

### Frontend Debugging

1. **DevTools**
   ```
   Press: F12 or Cmd+Alt+I in Electron window
   ```

2. **Console Logging**
   ```typescript
   console.log('Debug message', variable);
   ```

3. **React DevTools**
   - Install Chrome extension
   - Inspect component tree and state

### Backend Debugging

1. **Python Debugger**
   ```python
   import pdb; pdb.set_trace()
   ```

2. **Logging**
   ```python
   logger.info('Message')
   logger.error('Error', exc_info=True)
   ```

3. **View Logs**
   ```bash
   tail -f ~/.lcars/logs/lcars_agent.log
   ```

### Testing API Calls

```bash
# Test health check
curl http://localhost:5000/health

# Test query endpoint
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello computer"}'
```

## Performance Optimization

### Frontend Optimization

1. **React Memoization**
   ```typescript
   const MemoComponent = React.memo(MyComponent);
   ```

2. **useCallback for event handlers**
   ```typescript
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

3. **CSS Animation Optimization**
   ```css
   /* Use transform instead of position changes */
   transform: translateX(10px);
   /* Trigger GPU acceleration */
   will-change: transform;
   ```

### Backend Optimization

1. **Conversation History Limiting**
   ```python
   if len(self.conversation_history) > 10:
       self.conversation_history = self.conversation_history[-10:]
   ```

2. **Response Streaming**
   ```python
   # Stream large responses instead of buffering
   @app.route('/stream')
   def stream_response():
       return Response(generate(), mimetype='text/event-stream')
   ```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages

```
[Type] Brief description (50 chars max)

Longer description if needed.
- Bullet point for details
- Another point

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

### Creating Pull Requests

1. **Push your branch**
   ```bash
   git push -u origin feature/your-feature
   ```

2. **Create PR** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] No console errors or warnings
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No sensitive data in commits
- [ ] Performance considered
- [ ] Accessibility considered
- [ ] Cross-browser compatibility (if applicable)

## Release Process

1. **Update version**
   - `package.json` (frontend)
   - `backend/lcars_agent/__init__.py` (backend)
   - `README.md` (if major changes)

2. **Build and test**
   ```bash
   npm run build
   npm run dist
   ```

3. **Create release notes**
   - Features added
   - Bugs fixed
   - Breaking changes

4. **Tag release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Resources

- [Claude API Documentation](https://docs.anthropic.com)
- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Getting Help

- Check existing GitHub issues
- Review architecture in `ARCHITECTURE.md`
- Ask in development discussions
- Check logs for error messages

## Tips & Tricks

### Quick App Restart
```bash
# In frontend terminal
npm run dev  # Auto-restarts Electron

# In backend terminal
# Ctrl+C to stop, then restart python command
```

### Accessing Backend from Frontend
```typescript
// Through Socket.IO
BackendService.processTextQuery('query')

// Through REST API
fetch('http://localhost:5000/api/endpoint')
```

### Voice Testing Without Microphone
1. Click the microphone button
2. Type in the text input field
3. Click send button

### Viewing Network Traffic
```
DevTools → Network tab
```

---

Happy coding! Remember to follow the code conventions and test thoroughly before submitting PRs.
