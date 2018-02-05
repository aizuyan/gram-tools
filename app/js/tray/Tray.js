"use strict";

var path = require('path');
const {Menu, Tray} = require('electron')

function InitTray() {
    var trayIcon = null;

    if (process.platform === 'darwin') {
        trayIcon = new Tray(path.join(__dirname, "../..", 'assets/img/logoTemplate.png'));
    }
    else {
        trayIcon = new Tray(path.join(__dirname, "../..", 'assets/img/logo.png'));
    }

    var trayMenuTemplate = [
        {
            label: "Grap Tools",
            enabled: false
        },
        {
            label: "退出",
            enabled: false
        }
    ];
    var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    trayIcon.setContextMenu(trayMenu);
};

exports.InitTray = InitTray;