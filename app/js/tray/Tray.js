"use strict";

var path = require('path');
const {Menu, Tray} = require('electron')

function InitTray(app, win) {
    var trayIcon = null;

    if (process.platform === 'darwin') {
        trayIcon = new Tray(path.join(__dirname, "../..", 'assets/img/logoAlien16x16.png'));
    }
    else {
        trayIcon = new Tray(path.join(__dirname, "../..", 'assets/img/logoAlien16x16.png'));
    }
    trayIcon.setToolTip("GramTools")

    var trayMenuTemplate = [
        {
            label: "Gram Tools",
            click: () => {
                app.emit('show')
            }
        },
        {
            type: "separator"
        },
        {
            label: "退出",
            accelerator: 'CommandOrControl+Q',
            click: () => {
                app.quit()
            }
        }
    ];
    var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    trayIcon.setContextMenu(trayMenu);

    trayIcon.on('click', () => {
        if (process.platform === 'win32') {
            app.emit('show')
        }
    });
};

exports.InitTray = InitTray;