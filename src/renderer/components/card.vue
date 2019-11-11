<template>
  <div>
    <div class="center">
      <div class="card green">
        <div class="additional">
          <div class="user-card">
            <div class="icon-wrap">
              <span
                v-if="item.iconloaded !== true"
                :style="{background: color[index % color.length]}"
              >{{ item.name[0].toUpperCase() }}</span>
              <img
                class="circle"
                v-if="item.iconloaded !== false"
                :src="item.icon || getIcon(item)"
                alt="图标"
                @error="handleImgError(item)"
                @load="handleImgLoad(item)"
              />
            </div>
          </div>
          <div class="more-info">
            <h1 class="f-toe">{{item.name}}</h1>
            <div class="coords" v-for="keyword in item.keyWords.split(',')" :key="keyword">
              <span>{{keyword}}</span>
            </div>
            <div class="stats">
              <div>
                <i class="iconfont iconlianjie" />
                <div class="title">外部打开</div>
              </div>
              <div>
                <i class="iconfont iconguanlianshuxingneiqian" />
                <div class="title">内嵌打开</div>
              </div>
              <div>
                <i class="iconfont iconicon_edit" />
                <div class="title">编辑</div>
              </div>
              <div>
                <i class="iconfont iconshanchu" />
                <div class="title">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="general">
          <h1 class="f-toe">{{item.name}}</h1>
          <p>{{item.desc}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @note
 * @author chengzhenyu@corp.netease.com
 * @date 代码片段生成
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-11-11 18:45:11
 */
import { color } from "../const";
import { ipcRenderer } from "electron";

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      
    }
  },
  data() {
    return {
      color
    };
  },
  methods: {
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
<style lang="less" scoped>
.center {
  transform: scale(0.65);
  position: absolute;
  top: -50px;
  left: -80px;
  /* transform: translate(-50%, -50%); */
}

.card {
  width: 450px;
  height: 250px;
  background-color: #fff;
  background: linear-gradient(#f8f8f8, #fff);
  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin: 1.5rem;
}

.card h1 {
  text-align: center;
}

.card .additional {
  position: absolute;
  width: 150px;
  height: 100%;
  background: linear-gradient(#de685e, #ee786e);
  transition: width 0.4s;
  overflow: hidden;
  z-index: 2;
}

.card.green .additional {
  background: linear-gradient(#92bca6, #a2ccb6);
}

.card:hover .additional {
  width: 100%;
  border-radius: 0 5px 5px 0;
}

.card .additional .user-card {
  width: 150px;
  height: 100%;
  position: relative;
  float: left;
}

.card .additional .user-card::after {
  content: "";
  display: block;
  position: absolute;
  top: 10%;
  right: -2px;
  height: 80%;
  border-left: 2px solid rgba(0, 0, 0, 0.025);
}

.card .additional .user-card .level,
.card .additional .user-card .points {
  top: 15%;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.125rem 0.75rem;
  border-radius: 100px;
  white-space: nowrap;
}

.card .additional .user-card .points {
  top: 85%;
}

.card .additional .user-card svg {
  top: 50%;
}

.card .additional .more-info {
  width: 300px;
  float: left;
  position: absolute;
  left: 150px;
  height: 100%;
}

.card .additional .more-info h1 {
  color: #fff;
  margin-bottom: 0;
}

.card.green .additional .more-info h1 {
  color: #224c36;
}

.card .additional .coords {
  margin: 0 1rem;
  color: #fff;
  font-size: 1rem;
}

.card.green .additional .coords {
  color: #325c46;
}

.card .additional .coords span + span {
  float: right;
}

.card .additional .stats {
  font-size: 2rem;
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  top: auto;
  color: #fff;
}

.card.green .additional .stats {
  color: #325c46;
}

.card .additional .stats > div {
  flex: 1;
  text-align: center;
}

.card .additional .stats i {
  display: block;
}

.card .additional .stats div.title {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.card .additional .stats div.value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.card .additional .stats div.value.infinity {
  font-size: 2.5rem;
}

.card .general {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 1rem;
  padding-top: 0;
}

.card .general .more {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9em;
}

.f-toe {
  overflow: hidden;
  word-wrap: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.stats {
  .iconfont {
    font-size: 36px;
  }
  .title {
    font-size: 14px !important;
  }
}

.coords {
  font-size: 18px;
  margin-top: 10px;
}

.icon-wrap {
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 110px;
    position: absolute;
    max-height: 110px;
  }

  span {
    width: 110px;
    height: 110px;
    text-align: center;
    line-height: 110px;
    font-size: 56px;
    background: #e0cece;
    border-radius: 100px;
  }
}

.user-card {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>