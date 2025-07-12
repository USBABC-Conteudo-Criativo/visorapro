
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let serverProcess;

function waitForServer(callback) {
  const checkServer = () => {
    http.get('http://0.0.0.0:3000', (res) => {
      if (res.statusCode === 200) {
        callback();
      } else {
        setTimeout(checkServer, 1000);
      }
    }).on('error', () => {
      setTimeout(checkServer, 1000);
    });
  };
  checkServer();
}

function startServer() {
  serverProcess = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'inherit'
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'public', 'index.html'));
  } else {
    waitForServer(() => {
      mainWindow.loadURL('http://0.0.0.0:3000');
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  if (!app.isPackaged) {
    startServer();
    setTimeout(createWindow, 2000);
  } else {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
