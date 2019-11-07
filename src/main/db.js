import Datastore from 'nedb'
import { app } from 'electron'
import nodejieba from 'nodejieba';
const db = new Datastore({ filename: `${app.getPath('appData')}/electron-search.db`, autoload: true });
if(process.env.NODE_ENV === 'development') {
    db.remove({}, { multi: true }, function (err, numRemoved) {});

}
// URL作为主键
// [{ name: '2222', keyWords: ['test', '2222'], desc: '2222', url: '22222222', icon: '2222' }]
let mockData = [
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

// 有就更新，没有就插入

mockData.forEach((ele) => {
    db.update({ url: ele.url }, ele, { upsert: true }, function (err, numReplaced, upsert) {
        if (err) {
            throw (err)
        } else {
            console.log(numReplaced, upsert)
        }
    });
});

/**
 * 分词 -> 按照分词查询 -> 搜索字符串与结果字符串匹配度并排序
 * 名称-> URL-> 关键字-> 描述 加权排序
 * @param {string} searchKey 搜索字符串
 */
// //

let search = function ({ searchKey }) {
    // 分词
    let searchTokens = nodejieba.cutHMM(searchKey);
    console.log(searchKey, searchTokens);// 英文分词会被切分成字母。。
    // 所搜索项必须全包括分词的结果才会被搜索出来，可以无序
    let regString = searchTokens.map(ele => `(?=.*?${ele})`).join('')
    let reg = new RegExp(regString);
    return new Promise((reslove, reject) => {
        db.find({
            $or: [{
                url: { $regex: reg }
            }, {
                name: { $regex: reg }
            }, {
                keyWords: { $regex: reg }
            }, {
                desc: { $regex: reg }
            }]
        }, function (err, docs) {
            if (err) {
                reject(err)
            } else {
                reslove(docs)
            }
        });
    })
}

let update = function (ele) {
    if (ele.url[ele.url.length - 1] === '/') {
        ele.url = ele.url.slice(0, ele.url.length - 1);
    }
    db.update({ url: { $regex: new RegExp(`${ele.url}\/?`) } }, ele, { upsert: true }, function (err, numReplaced, upsert) {
        if (err) {
            throw (err)
        } else {
            console.log(numReplaced, upsert)
        }
    });
}
let find = function (options) {
    return new Promise((reslove, reject) => {
        db.find(options, function (err, docs) {
            if (err) {
                reject(err)
            } else {
                reslove(docs)
            }
        });
    })
}

export default {
    search,
    update,
    find,
}

/**
 * 第三方接口增量更新搜索结果，不同步更新
 */