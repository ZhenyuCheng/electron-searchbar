<template>
  <div v-if="iframeUrl">
    <iframe
      :src="iframeUrl"
      width="1000"
      height="650"
      frameborder="0"
      @load="handleLoad"
    />
    <a
      class="btn-floating waves-effect waves-light blue"
      @click="backToList"
    >
      <i class="iconfont iconfanhui" />
    </a>
    <div
      v-if="loading"
      class="loading"
    >
      <img
        src="../../../static/assets/loading.svg"
        alt="loading"
      >
    </div>
  </div>
  <div v-else>
    <div
      v-for="(item, index) in list"
      :key="item.url"
      class="item-wrap"
      :class="{card: activeIndex === index}"
      @click="handleClick(item, index)"
    >
      <div class="icon-wrap">
        <span
          v-if="item.iconloaded !== true"
          :style="{background: color[index % color.length]}"
        > {{ item.name[0].toUpperCase() }}</span>

        <img
          v-if="item.iconloaded !== false"
          :src="item.icon || getIcon(item)"
          alt="图标"
          @error="handleImgError(item)"
          @load="handleImgLoad(item)"
        >
      </div>
      <div class="info-wrap">
        <div class="name">
          {{ item.name }}
        </div>
        <div
          class="desc f-toe"
          :title="item.desc || item.url"
        >
          {{ item.desc || item.url }}
        </div>
      </div>
      <i
        v-if="activeIndex === index"
        class="iconfont iconEnter"
      />
    </div>
  </div>
</template>
<script>
/**
 * 
 * @note 列表展示区域，TODO: enter键跳转，上下键切换active
 * @author chengzhenyu@corp.netease.com
 * @date 代码片段生成
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-10-29 17:00:44
 */
import { ipcRenderer } from 'electron';
import { color } from '../const';
import 'mousetrap';

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    iframeUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      color
    }
  },
  watch: {
    list() {
      this.loading = true;
      this.$emit('reset');
    }
  },
  created() {
    ipcRenderer.on('icon-result', (event, arg) => {
      let result = this.list.find(ele => ele.url === arg.url);
      result.icon = arg.icon;
      result.iconloaded = true;
    });
    Mousetrap.bind('up', () => {
      this.$emit('up');
    });
    Mousetrap.bind('down', () => {
      this.$emit('down');
    });
  },
  methods: {
    handleLoad() {
      this.loading = false;
    },
    handleClick(item, index) {
      this.$emit('enter', item, index);
    },
    backToList() {
      this.$emit('reset', ['iframeUrl']);
    },
    getIcon(item) {
      if (!item.icon) {
        ipcRenderer.send('get-icon', item);
      }
      let protocol = item.url.split('//')[0];
      let path = item.url.split('//')[1];
      let domain = path.split('/')[0];
      return `${protocol}//${domain}/favicon.ico`;
    },
    handleImgError(item) {
      item.iconloaded = false;
      this.$forceUpdate();
    },
    handleImgLoad(item) {
      item.iconloaded = true;
      this.$forceUpdate();
    }
  },
}
</script>

<style lang="less"
  scoped>
.btn-floating {
  position: fixed;
  right: 10px;
  bottom: 10px;
}

.loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.item-wrap {
  height: 50px;
  overflow: hidden;
  width: 100%;
  display: flex;
  padding: 4px 10px;

  .icon-wrap {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 42px;
      position: absolute;
      max-height: 42px;
    }

    span {
      width: 42px;
      height: 42px;
      text-align: center;
      line-height: 42px;
      font-size: 24px;
      background: #e0cece;
      border-radius: 50px;
    }
  }
}

.info-wrap {
  width: calc(100% - 60px);
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;

  .name {
    font-size: 20px;
    width: 100%;
    line-height: 100%;
  }

  .desc {
    font-size: 12px;
    color: #2323238c;
    line-height: 100%;
  }
}

.f-toe {
  overflow: hidden;
  word-wrap: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card {
  margin: 0;
}

.iconEnter {
  line-height: 42px;
  margin-right: 10px;
  font-size: 20px;
  color: #ccc;
}
</style>