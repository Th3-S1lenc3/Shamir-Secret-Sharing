const { app, dialog, BrowserWindow, ipcMain, Menu } = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const isMac = process.platform === 'darwin';
const fs = require('fs');

let mainWindow;

const homepage = 'https://github.com/Th3-S1lenc3/Shamir-Secret-Sharing';

const menuTemplate = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal(homepage);
        }
      },
      {
        label: 'Search Issues',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal(path.join(homepage, 'issues'))
        }
      },
    ]
  }
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

function createWindow() {
  let width = 900;
  let height = 680;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: width,
    minHeight: height,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`);
  isDev ? mainWindow.webContents.openDevTools() : null;
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('save:file', (event, data) => {
  saveFile(data);
});

ipcMain.on('save:files', (event, data) => {
  saveFiles(data);
});

ipcMain.on('upload:files', (event, data) => {
  openFile(false, data);
});

ipcMain.on('upload:files:one', (event, data) => {
  openFile(true, data);
});


async function saveFiles(data) {
  console.log('Save Files.');
  const dir = await dialog.showOpenDialog(mainWindow, {
    title: 'Save files to:',
    buttonLabel: 'Save Here',
    defaultPath: app.getPath('documents'),
    properties: ['openDirectory'],
  });

  data.forEach((share, part) => {
    try {
      const { filePaths: filePathRoot } = dir;
      const fileName = `share_${part}.txt`;
      const filePath = path.join(filePathRoot[0], fileName);
      const fileContent = share;

      fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
          throw err;
        }
      })
    }
    catch (err) {
      console.log(err);
      let error = dialog.showErrorBox('An Error Occurred.', err);
    }
  });
}

async function saveFile(data) {
  console.log('Save File.');
  const { fileName, fileContent } = data;
  const file = await dialog.showSaveDialog(mainWindow, {
    title: 'Save As',
    buttonLabel: 'Save',
    defaultPath: path.join(app.getPath('documents'), fileName),
    filters: [
      {
        name: 'Text Files',
        extentions: ['txt'],
      },
    ],
  })
  const { canceled, filePath } = file;
  if (!canceled) {
    try {
      fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    catch (err) {
      let error = dialog.showErrorBox('An Error Occurred.', err);
    }
  }
}

function openFile(oneFile, caller) {
  console.log('Open File.');
  const files = dialog.showOpenDialog(mainWindow, {
    title: 'Open File',
    defaultPath: app.getPath('documents'),
    properties: [
      'openFile',
      ...(oneFile ? [] : [
        'multiSelections',
      ]),
    ],
    filters: [
      {
        name: 'Text Files',
        extentions: ['txt'],
      }
    ],
  }).then((result) => {
    const { canceled, filePaths } = result;

    if (!canceled) {
      const files = [];
      for (let file in filePaths) {
        let fileName = filePaths[file].split('/').pop();
        let fileContent = fs.readFileSync(filePaths[file]).toString();
        let fileJSON = {
          fileName: fileName,
          fileContent: fileContent,
        };
        files.push(fileJSON);
      }
      mainWindow.webContents.send('upload:files:reply', {
        caller: caller,
        files: files
      });
    }
  });
}
