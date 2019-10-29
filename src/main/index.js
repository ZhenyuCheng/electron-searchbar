/**
 * @note TODO:拦截iframe中搜索
 * @author chengzhenyu@corp.netease.com
 * @date 2019-10-23 21:16:15
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-10-29 17:17:07
 */
import { app, BrowserWindow, globalShortcut, ipcMain, shell} from 'electron'
import db from './db';
import similarity from './similarity';
import favicon from "favicon";
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// 暂时弄大一点方便测试
const windowWidth = 1000//800
const minWindowHeight = 43;
const maxWindowHeight = 700//500;

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
      devTools: true
    },
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

  ipcMain.on('search', (event, arg) => {
    if(!arg) {
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

  // 走到这里说明没有指定icon
  ipcMain.on('get-icon', (event, arg) => {
    favicon(arg.url, (err, favicon_url) => {
      if (favicon_url) {
        arg.icon = favicon_url;
        event.reply('icon-result', arg);
        // 更新数据库icon
        db.update(arg);
      }
    })
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
  log.error(error.stack || JSON.stringify(error));
  app.exit();
});