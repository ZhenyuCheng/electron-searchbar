import Datastore from 'nedb'
import { app } from 'electron'
import nodejieba from 'nodejieba';
import {mockData} from '../mockData'

const db = new Datastore({ filename: `${app.getPath('appData')}/electron-search.db`, autoload: true });

if(process.env.NODE_ENV === 'development') {
    db.remove({}, { multi: true }, function (err, numRemoved) {});

}

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