const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Voice control
  sendVoiceQuery: (query) => ipcRenderer.send('voice-query', query),
  onActivateVoice: (callback) => ipcRenderer.on('activate-voice', callback),
  onProcessingQuery: (callback) => ipcRenderer.on('processing-query', callback),
  onResponse: (callback) => ipcRenderer.on('agent-response', callback),

  // Window control
  minimize: () => ipcRenderer.send('minimize'),
  quit: () => ipcRenderer.send('quit'),

  // API communication
  sendToBackend: (channel, data) => ipcRenderer.send(channel, data),
  onFromBackend: (channel, callback) => ipcRenderer.on(channel, (event, data) => callback(data)),

  // System info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
});
