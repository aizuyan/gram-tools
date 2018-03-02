"use strict";

const {Menu, Tray} = require('electron');
const os = process.platform

function InitMenu(app, win) {
    let template = [
        {
            label: "编辑",
            submenu: [
                { 
                    label: "撤销",
                    role: "undo"
                },
                {
                    label: "重做",
                    role: "redo"
                },
                {
                  type: "separator"
                },
                {
                  label: "剪切",
                  role: "cut"
                },
                {
                  label: "复制",
                  role: "copy"
                },
                {
                  label: "粘贴",
                  role: "paste"
                },
                {
                  label: "删除",
                  role: "delete"
                },
                {
                  label: "全选",
                  role: "selectall"
                }
            ]
        }
    ];

    if (os === 'darwin') {
        template.unshift({
            label: "GramTools",
            submenu: [
                { label: "关于 GramTools"},
                { type: "separator" },
                {
                    label: "退出",
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        });
    }


    //注册菜单  
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
exports.InitMenu = InitMenu;