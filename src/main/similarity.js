import stringSimilarity from 'string-similarity'

// url: 'http://www.360.com',
// name: '360',
// keyWords: '搜索,中国',
// type: 'blank', // 跳转默认浏览器打开
// desc: '360搜索产品',

/**
 * 比较两个字符串，返回相似度，处理单个字符长度为1的情况
 * @param {String} first 第一个字符串
 * @param {String} second 
 */
let compareTwoStrings = function (first, second) {
    if (first == second) {
        return 1;
    }
    if (first.length === 1 || second.length === 1) {
        let max = Math.max(first.length, second.length);
        let min = Math.min(first.length, second.length);
        return min/max;
    } else {
        return stringSimilarity.compareTwoStrings(first, second);
    }
}
let sort = function (searchResult, searchKey) {
    // console.log('sort', searchResult, searchKey)
    searchResult = searchResult.map((ele) => {
        let { url, name, keyWords, desc } = ele;
        let urlRate = compareTwoStrings(url, searchKey);
        let nameRate = compareTwoStrings(name, searchKey);
        // console.log(name, searchKey, nameRate)
        let keyWordsRate = compareTwoStrings(keyWords, searchKey);
        let descRate = compareTwoStrings(desc, searchKey);
        // console.log(ele, urlRate, nameRate, keyWordsRate, descRate)
        // url:名称:关键字:描述对的权重比 为 10:10:5:3
        ele.rate = 10 * urlRate + 10 * nameRate + 5 * keyWordsRate + 3 * descRate;
        return ele;
    })

    return searchResult.sort((a, b) => b.rate - a.rate);

}

export default {
    sort
}