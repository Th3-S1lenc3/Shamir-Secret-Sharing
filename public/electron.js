const { app, dialog, BrowserWindow, ipcMain, Menu } = require('electron');
const { createWorker } = require('tesseract.js');
const worker = createWorker({
  logger: m => console.log(m),
});
const QRCode = require('qrcode');
const QRReader = require('qrcode-reader');
const jimp = require('jimp');


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

ipcMain.on('save:files', (event, data) => {
  saveFiles(data);
});

ipcMain.on('save:files:one', (event, data) => {
  saveFile(data);
});

ipcMain.on('save:qrCode', (event, data) => {
  saveQRCode(data);
})

ipcMain.on('save:qrCodes', (event, data) => {
  saveQRCodes(data);
})

ipcMain.on('upload:files', (event, data) => {
  openFile(false, data);
});

ipcMain.on('upload:files:one', (event, data) => {
  openFile(true, data);
});

ipcMain.on('upload:qrCodes', (event, data) => {
  openQRCode(false, data);
});

ipcMain.on('upload:qrCodes:one', (event, data) => {
  openQRCode(true, data);
});

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

async function saveQRCode(data) {
  console.log('Save QR Code.');
  const { fileName, fileContent } = data;
  const file = await dialog.showSaveDialog(mainWindow, {
    title: 'Save As',
    buttonLabel: 'Save',
    defaultPath: path.join(app.getPath('pictures'), fileName),
    filters: [
      {
        name: 'Images',
        extentions: ['png'],
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
      console.log(err);
      let error = dialog.showErrorBox('An Error Occurred.', err);
    }
  }
}

async function saveQRCodes(data) {
  console.log('Save QR Codes.');
  const dir = await dialog.showOpenDialog(mainWindow, {
    title: 'Save files to:',
    buttonLabel: 'Save Here',
    defaultPath: app.getPath('pictures'),
    properties: ['openDirectory'],
  });

  data.forEach((share, part) => {
    try {
      const { filePaths: filePathRoot } = dir;
      const fileName = `share_${part}.txt`;
      const filePath = path.join(filePathRoot[0], fileName);
      const fileContent = share;

      QRCode.toFile(filePath, fileContent, null, (err) => {
        if (err) throw err
      });
    }
    catch (err) {
      console.log(err);
      let error = dialog.showErrorBox('An Error Occurred.', err);
    }
  });
}

async function openFile(oneFile, caller) {
  console.log('Open File.');
  const files = await dialog.showOpenDialog(mainWindow, {
    title: 'Open File',
    defaultPath: app.getPath('documents'),
    properties: [
      'openFile',
      ...(oneFile ? '' : 'multiSelections'),
    ],
    filters: [
      {
        name: 'Text Files',
        extentions: ['txt'],
      }
    ],
  });

  const { canceled, filePaths } = files;

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
    mainWindow.webContents.send('upload:reply', {
      caller: caller,
      files: files
    });
  }
}

async function openQRCode(oneFile, caller) {
  console.log('Open QR Code.');
  const files = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Image',
    defaultPath: app.getPath('pictures'),
    properties: [
      'openFile',
      ...(oneFile ? '' : 'multiSelections'),
    ],
    filters: [
      {
        name: 'Images',
        extentions: ['png'],
      }
    ],
  });

  const { canceled, filePaths } = files;

  if (!canceled) {
    const files = [];
    for (let file in filePaths) {
      let fileName = filePaths[file].split('/').pop();
      let fileContent = readQRCode(filePaths[file]).toString();
      let fileJSON = {
        fileName: fileName,
        fileContent: fileContent,
      };
      files.push(fileJSON);
    }
    mainWindow.webContents.send('upload:reply', {
      caller: caller,
      files: files
    });
  }
}

async function readQRCode() {
  const img = await jimp.read(fs.readFileSync('./qrcode.png'));

  const qr = new QRReader();

  // qrcode-reader's API doesn't support promises, so wrap it
  const { result } = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
    qr.decode(img.bitmap);
  });

  return result;
}
