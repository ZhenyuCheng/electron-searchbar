// URL作为主键
// [{ name: '2222', keyWords: ['test', '2222'], desc: '2222', url: '22222222', icon: '2222' }]
export const mockData = [
    {
        // _id: 'http://www.baidu.com',
        url: 'http://www.baidu.com',
        name: '百度',
        keyWords: '搜索',
        type: 'insert', // 内嵌
        desc: '百度旗下的搜索产品',
        // icon: 'http://www.google.com/s2/favicons?domain=www.baidu.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'http://www.1111.com',
        name: '谷歌',
        keyWords: '搜索',
        type: 'blank', // 跳转默认浏览器打开
        desc: 'Google旗下的搜索产品，百度的对手',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'https://www.yuque.com/dashboard',
        name: '语雀-外网-工作台',
        keyWords: '笔记,语雀',
        type: 'insert', // 跳转默认浏览器打开
        desc: '阿里语雀知识库-外网',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'http://www.materializecss.cn/forms.html',
        name: 'materializecss',
        keyWords: 'css',
        type: 'insert', // 跳转默认浏览器打开
        desc: 'materializecss样式库',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'https://segmentfault.com',
        name: 'segmentfault',
        keyWords: '问答',
        type: 'insert', // 跳转默认浏览器打开
        desc: '问答社区',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'https://segmentfault.com',
        name: 'segmentfault',
        keyWords: '问答',
        type: 'insert', // 跳转默认浏览器打开
        desc: '问答社区',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },
    {
        // _id: 'http://www.google.com',
        url: 'http://www.2.com',
        name: '360',
        keyWords: '搜索,中国',
        type: 'blank', // 跳转默认浏览器打开
        desc: '360搜索产品百',
        // icon: 'http://www.google.com/s2/favicons?domain=www.google.com'
    },

    {
        url: 'https://nos.kaolafed.com',
        name: 'nos上传',
        keyWords: '上传,网易',
        type: 'insert', // 跳转默认浏览器打开
        desc: '网易上传地址',
    }, {
        url: 'https://hao.360.cn/',
        name: '导航',
        keyWords: '导航',
        type: 'insert', // 跳转默认浏览器打开
        desc: '360地址导航',
    }
]