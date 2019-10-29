<template>
  <div id="app">
    <!-- <landing-page></landing-page> -->
    <inputArea
      :search-first-result="list[0] && list[0].name"
      @search="handleSearch"
      @enter="handleEnter"
      @up="handleUp"
      @down="handleDown"
      @fold="handleFold"
    />

    <listArea
      :list="list"
      :active-index="activeIndex"
      :iframe-url="iframeUrl"
      @enter="handleEnter"
      @up="handleUp"
      @reset="handleReset"
      @down="handleDown"
    />
  </div>
</template>

<script>
/**
 * @note TODO: enter键跳转，上下键切换active
 * @author chengzhenyu@corp.netease.com
 * @date 2019-10-17 23:10:54
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-10-29 15:20:59
 */
import { ipcRenderer } from 'electron';
import inputArea from '@/components/inputArea';
import listArea from '@/components/listArea';

export default {
  name: 'ElectronVue',
  components: {
    inputArea,
    listArea
  },
  data() {
    return {
      list: [],
      activeIndex: 0,
      iframeUrl: ''
    }
  },
  created() {
    // 监听搜索结果
    ipcRenderer.on('search-result', (event, arg) => {
      this.list = arg;
      // this.handleReset(['iframeUrl'])
      // console.log(arg) // prints "pong"
    })
  },
  methods: {
    handleSearch($event) {
      //TODO:做一些展开时的事情
      ipcRenderer.send('search', {
        searchKey: $event
      });
    },
    handleFold(clear) {
      // do something
      if (clear) {
        this.list = [];
      }
    },
    handleUp() {
      if (this.activeIndex > 0) {
        this.activeIndex--;
      }
    },
    handleDown() {
      if (this.activeIndex < this.list.length - 1) {
        this.activeIndex++;
      }
    },
    handleReset(fields) {
      if (Array.isArray(fields) && fields.length > 0) {
        fields.forEach(element => {
          if (typeof this[element] == 'number') {
            this[element] = 0;
          } else if (Array.isArray(this[element])) {
            this[element] = [];
          } else {
            this[element] = '';
          }
        });
      } else {
        this.iframeUrl = ''
        this.activeIndex = 0;
      }
    },
    handleEnter(arg, index) {
      if(index || index === 0) {
        this.activeIndex = index;
      }
      let item = arg || this.list[this.activeIndex];
      if(!item) return;
      if (item.type === 'blank') {
        ipcRenderer.send('goto', item);
      } else {
        this.iframeUrl = item.url;
      }
    }
  }
}
</script>

<style>
/* CSS */
body {
  overflow: hidden;
  width: 100%;
}
</style>