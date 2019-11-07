/**
 * @note TODO:拦截iframe中搜索
 * @author chengzhenyu@corp.netease.com
 * @date 2019-10-23 21:16:15
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-11-08 01:12:13
 */
import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import db from './db';
import similarity from './similarity';
import { URL } from "url";
import request from 'request';
import cheerio from 'cheerio';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`

// 暂时弄大一点方便测试
const windowWidth = 1000 //800
const minWindowHeight = 43;
const maxWindowHeight = 700 //500;
let currentIframe = [];
function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: minWindowHeight,
        useContentSize: true,
        width: windowWidth,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            webviewTag: true,
        },
        zoomToPageWidth: true,
        center: true,
        resizable: false,
        movable: false,
        // focusable: false,
        alwaysOnTop: true,
        show: false,
        frame: false,
    })

    // 加载页面
    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // 禁止缩放
    let webContents = mainWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.setLayoutZoomLevelLimits(0, 0);
    });
    // Event: 'did-start-navigation'
    // Event: 'did-navigate-in-page'
    // Event: 'did-frame-navigate'
    // Event: 'did-start-navigation'

    webContents.on('did-start-navigation', (event, navigationUrl, isInPlace, isMainFrame, frameProcessId, frameRoutingId) => {
        const parsedUrl = new URL(navigationUrl)
        //  会检测到子级iframe，所以视图区域设置的时候需要取第一个
        console.log(new Date().getTime(), navigationUrl, isInPlace, isMainFrame, frameProcessId, frameRoutingId)
        if (!isMainFrame) {
            currentIframe.push(navigationUrl);
        }
        // if (parsedUrl.origin !== 'https://example.com') {
        //     event.preventDefault()
        // }
    })

    webContents.on('new-window', async (event, navigationUrl) => {
        // In this example, we'll ask the operating system
        // to open this event's url in the default browser.
        const parsedUrl = new URL(navigationUrl);
        // console.log(parsedUrl)
        event.preventDefault();

        // await shell.openExternal(navigationUrl)
    })

    // 注册快捷键
    globalShortcut.register('Alt+A', () => {
        if (!mainWindow.isVisible()) {
            app.dock.hide();
            mainWindow.showInactive();
            mainWindow.focus();
        } else {
            mainWindow.hide();
            app.dock.show();
        }
    })

    // 监听应用失焦事件
    app.on('browser-window-blur', () => {
        mainWindow.hide();
        app.dock.show();
    })
    // 处理渲染进程抛出的事件
    ipcMain.on('change-window', (event, arg) => {
        if (arg === 'small') {
            mainWindow.setSize(windowWidth, minWindowHeight, true)
        } else {
            mainWindow.setSize(windowWidth, maxWindowHeight, true)
        }
    })
    ipcMain.on('iframe-load', (event) => {
        // 解析URL获取，icon，title，desc，keyword
        let url = currentIframe[0];
        console.log('----',url)
        if (url) {
            request(url, function (err, res, body) {
                if (err) {
                    event.reply('current-iframe-url', url);
                    return;
                }
                const $ = cheerio.load(body);
                let icon = ($('link[rel~="icon"]')[0] && $('link[rel~="icon"]')[0].attribs.href) ||
                    ($('link[rel~="ICON"]')[0] && $('link[rel~="ICON"]')[0].attribs.href);
                const parseUrl = new URL(url);
                if (icon) {
                    if (!/^http/.test(icon)) {
                        // 不是http开头
                        if (icon[0] === '/') {
                            icon = `${parseUrl.origin}${icon}`
                        } else {
                            icon = `${parseUrl.origin}/${icon}`
                        }
                    }
                } else {
                    icon = `${parseUrl.origin}/favicon.ico`
                }
                if (url[url.length - 1] === '/') {
                    url = url.slice(0, url.length - 1);
                }
                let type = 'blank';
                db.find({ url: { $regex: new RegExp(`${url}\/?`) } }).then((list) => {
                    type = list[0] ? list[0].type: type;
                }).finally(() => {
                    event.reply('current-iframe-url', {
                        url,
                        keyWords: $('meta[name="keywords"]')[0] && $('meta[name="keywords"]')[0].attribs.content,
                        name: $('title').text(),
                        desc: $('meta[name="description"]')[0] && $('meta[name="description"]')[0].attribs.content,
                        icon,
                        type
                    });
                    console.log({
                        url,
                        keyWords: $('meta[name="keywords"]')[0] && $('meta[name="keywords"]')[0].attribs.content,
                        name: $('title').text(),
                        desc: $('meta[name="description"]')[0] && $('meta[name="description"]')[0].attribs.content,
                        icon,
                        type
                    })
                })
            });
        } else {
            event.reply('current-iframe-url', '');
        }
        currentIframe = [];
    })
    ipcMain.on('reset-currentIframe', (event, arg) => {
        currentIframe = [];
    })
    
    ipcMain.on('search', (event, arg) => {
        if (!arg) {
            event.reply('search-result', []);
            return;
        }
        // 调用db.search 获取搜索结果返回
        db.search(arg).then((result) => {
            // 进行相似度排序
            result = similarity.sort(result, arg && arg.searchKey);
            // console.log(result);
            event.reply('search-result', result)
        }).catch((err) => {
            // console.log(err)
        })
    })

    ipcMain.on('collect-item', (event, arg) => {
        db.update(arg);
    })
    // 走到这里说明没有指定icon
    ipcMain.on('get-icon', (event, arg) => {
        request(arg.url, function (err, res, body) {
            if (err) {
                return;
            }
            const $ = cheerio.load(body);
            let icon = ($('link[rel~="icon"]')[0] && $('link[rel~="icon"]')[0].attribs.href) ||
                ($('link[rel~="ICON"]')[0] && $('link[rel~="ICON"]')[0].attribs.href);
            const parseUrl = new URL(arg.url);
            if (icon) {
                if (!/^http/.test(icon)) {
                    // 不是http开头
                    if (icon[0] === '/') {
                        icon = `${parseUrl.origin}${icon}`
                    } else {
                        icon = `${parseUrl.origin}/${icon}`
                    }
                }
            } else {
                icon = `${parseUrl.origin}/favicon.ico`
            }
            arg.icon = icon;
            event.reply('icon-result', arg);
            // 更新数据库icon
            db.update(arg);
        });
    })
    ipcMain.on('goto', (event, arg) => {
        shell.openExternal(arg.url)
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


// 必要的全局错误捕获
process.on('uncaughtException', error => {
    console.error(error.stack || JSON.stringify(error));
    app.exit();
});