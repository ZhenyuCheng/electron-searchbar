<template>
  <div v-if="expand || showGuide">
    <!-- iframe -->
    <div v-if="iframeUrl" :style="{width: `${iframe.width }px`, height: `${iframe.height}px`}">
      <iframe
        :src="iframeUrl"
        :width="iframe.width * scale"
        :style="{transform: `scale(${1/scale})`, position: 'absolute', top: `${-top}px`,left: `${-left}px`}"
        :height="iframe.height * scale"
        frameborder="0"
        name="test"
        ref="iframe"
        @load="handleLoad"
      />
      <div v-if="loading" class="loading">
        <img src="../../../static/assets/loading.svg" alt="loading" />
      </div>
    </div>
    <!-- 导航 -->
    <div v-else-if="showGuide">
      <div class="row guide-wrap">
        <div class="col s12 m4" v-for="(item, index) in mockData" :key="item.url">
            <card :item="item" :index="index"></card>
        </div>
      </div>
    </div>
    <!-- 列表 -->
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
          >{{ item.name[0].toUpperCase() }}</span>
          <img
            v-if="item.iconloaded !== false"
            :src="item.icon || getIcon(item)"
            alt="图标"
            @error="handleImgError(item)"
            @load="handleImgLoad(item)"
          />
        </div>
        <div class="info-wrap">
          <div class="name">{{ item.name }}</div>
          <div class="desc f-toe" :title="item.desc || item.url">{{ item.desc || item.url }}</div>
        </div>
        <i v-if="activeIndex === index" class="iconfont iconEnter" />
      </div>
    </div>

    <!-- <webview :src="iframeUrl"
            nodeintegration
            :style="{
            width: `${iframe.width * scale}px`, 
            height: `${iframe.height * scale}px`,
            transform: `scale(${1/scale})`, 
            position: 'absolute', 
            top: `${-top}px`,
            left: `${-left}px`
            }">
    </webview>-->
    <collectModal :visible.sync="showCollectModal" :iframe="iframe"></collectModal>
    <a
      class="btn-floating waves-effect waves-light guide"
      :class="{black: guideStorage}"
      @click="setGuide"
      title="切换导航默认展示"
    >
      <i class="iconfont icondaohang" />
    </a>
    <a
      class="btn-floating waves-effect waves-light red collect"
      @click.stop="collectSite"
      title="收藏或者添加条目"
    >
      <i class="iconfont iconshoucang" />
    </a>

    <a
      class="btn-floating waves-effect waves-light cadetblue switch"
      @click="changeScale"
      title="切换iframe的缩放"
    >
      <i class="iconfont iconbanbenqiehuan" />
    </a>

    <a class="btn-floating waves-effect waves-light blue back" @click="backToList" title="返回列表页">
      <i class="iconfont iconfanhui" />
    </a>
  </div>
</template>
<script>
/**
 *
 * @note 列表展示区域，TODO: enter键跳转，上下键切换active
 * @author chengzhenyu@corp.netease.com
 * @date 代码片段生成
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-11-11 18:48:28
 */
import { ipcRenderer } from "electron";
import { color } from "../const";
import collectModal from "../modals/collect";
import "mousetrap";
import { mockData } from "../../mockData";
import card from './card';

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
      default: ""
    },
    showGuide: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  components: {
    collectModal,
    card
  },
  data() {
    return {
      mockData, // 模拟数据
      loading: true,
      color,
      scale: 1.3, // iframe的缩放大小
      showCollectModal: false,
      guideStorage: false, // 默认导航模式
      iframe: {
        // iframe的宽高
        width: 1000,
        height: 650,
        minHeight: 43,
        url: "",
        name: "",
        keyWords: "",
        type: "blank", // 跳转默认浏览器打开
        desc: "",
        icon: ""
      }
    };
  },
  computed: {
    top() {
      return (
        (this.iframe.height * (this.scale - 1)) / 2 - this.iframe.minHeight
      );
    },
    left() {
      return (this.iframe.width * (this.scale - 1)) / 2;
    }
  },
  watch: {
    list() {
      this.loading = true;
      this.$emit("reset");
    }
  },
  created() {
    ipcRenderer.on("icon-result", (event, arg) => {
      let result = this.list.find(ele => ele.url === arg.url);
      if(result) {
        result.icon = arg.icon;
        result.iconloaded = true; 
      }
    });
    // 当前iframe中的实际URL
    ipcRenderer.on("current-iframe-url", (event, arg) => {
      Object.assign(this.iframe, arg);
    });
    Mousetrap.bind("up", () => {
      this.$emit("up");
    });
    Mousetrap.bind("down", () => {
      this.$emit("down");
    });
    this.guideStorage = localStorage.getItem("show-guide") || false; // 默认导航习惯为false
  },
  methods: {
    handleLoad(event) {
      this.loading = false;
      ipcRenderer.send("iframe-load");
      // console.log(window.frames.test.document,this.$refs.iframe.document.title)
      // console.log(this.$refs.iframe.contentWindow.location.href);
    },
    handleClick(item, index) {
      this.$emit("enter", item, index);
    },
    backToList() {
      this.$emit("reset", ["iframeUrl"]);
    },
    setGuide() {
      if (localStorage.getItem("show-guide")) {
        localStorage.setItem("show-guide", "");
        this.guideStorage = false;
      } else {
        localStorage.setItem("show-guide", true);
        this.guideStorage = true;
      }
    },
    //TODO: 后续可以记住每个页面的scale
    changeScale() {
      if (this.scale === 1) {
        this.scale = 1.3;
      } else {
        this.scale = 1;
      }
    },
    collectSite() {
      // 收藏当前网址
      this.showCollectModal = true;
    },
    getIcon(item) {
      if (!item.icon) {
        ipcRenderer.send("get-icon", item);
      }
      let protocol = item.url.split("//")[0];
      let path = item.url.split("//")[1];
      let domain = path.split("/")[0];
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
  }
};
</script>

<style lang="less"
    scoped>
.btn-floating {
  position: fixed;
  bottom: 10px;
  background-color: #abbbba;
}

.back {
  right: 10px;
}

.cadetblue {
  background-color: cadetblue;
}

.switch {
  right: 60px;
}

.collect {
  right: 110px;
}

.guide {
  right: 160px;
}

.loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.guide-wrap {
    margin: 10px;
    overflow: scroll;
    .m4 {
        position: relative;
        width: 320px;
        height: 190px;
    }
}
.item-wrap {
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
.item-wrap {
  height: 50px;
  overflow: hidden;
  width: 100%;
  display: flex;
  padding: 4px 10px;
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