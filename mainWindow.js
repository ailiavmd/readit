// Modules
const {BrowserWindow} = require('electron')

// BrowserWindow instance
exports.win

// mainWindow createWindow fn
exports.createWindow = () => {
    this.win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 350,
        minHeight: 300,
        // linux icon
        icon: `${__dirname}/icons/64x64png`
    })

    // Load main window content
    this.win.loadURL(`file://${__dirname}/renderer/main.html`)

    // Handle window closed
    this.win.on('closed', () => {
        this.win = null
    })

}