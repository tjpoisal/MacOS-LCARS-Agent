const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const startPythonBackend = () => {
  const pythonScript = path.join(
    __dirname,
    '../backend/lcars_agent/app.py'
  );

  pythonProcess = spawn('python3', [pythonScript], {
    stdio: 'pipe',
    detached: false,
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python Error] ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
};

const registerGlobalShortcuts = () => {
  // Register Cmd+Space as activation hotkey
  globalShortcut.register('cmd+space', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('activate-voice');
    }
  });

  // Register Cmd+Shift+Escape to close
  globalShortcut.register('cmd+shift+escape', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });
};

app.on('ready', () => {
  createWindow();
  startPythonBackend();
  registerGlobalShortcuts();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  if (pythonProcess) {
    pythonProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// IPC Handlers for frontend-backend communication
ipcMain.on('voice-query', (event, query) => {
  if (mainWindow) {
    mainWindow.webContents.send('processing-query', query);
  }
});

ipcMain.on('minimize', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});
