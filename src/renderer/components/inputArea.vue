<template>
    <div class="input-wrap">
        <i class="iconfont iconsearch" />
        <input ref="input"
            v-model="searchKey"
            type="text"
            class="main-input"
            autofocus
            placeholder="快捷搜索"
            @input="handleInput" />
        <input v-model="searchCombine"
            type="text"
            class="main-input hiddden-input"
            disabled />
        <i class="iconfont iconzhankai"
            title="手动展开后，除非手动收起，否则不会收起内容区"
            :class="{rotate: expand}"
            @click="triggerExpand" />
    </div>
</template>

<script>
import { ipcRenderer } from "electron";
import _ from "lodash";
export default {
    props: {
        searchFirstResult: {
            type: String,
            default: ""
        },
        iframeUrl: {
            type: String,
            default: ""
        },
        expand: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchKey: ""
        };
    },
    computed: {
        searchCombine() {
            if (this.searchKey && this.searchFirstResult) {
                return `${this.searchKey} - ${this.searchFirstResult}`;
            } else {
                return "";
            }
        }
    },
    mounted() {
        let vm = this;
        Mousetrap(this.$refs.input).bind("up", () => {
            vm.$emit("up");
            return false;
        });
        Mousetrap(this.$refs.input).bind("down", () => {
            vm.$emit("down");
            return false;
        });
        Mousetrap(this.$refs.input).bind("enter", () => {
            if (vm.iframeUrl) {
                // 如果在iframe中触发搜索
                vm.$emit("search", vm.searchKey);
                return;
            }
            vm.$emit("enter");
        });
    },
    methods: {
        triggerExpand() {
            if (!this.expand) {
                // 如果此时没有有搜索词，展示导航
                ipcRenderer.send("change-window", "large");
                setTimeout(() => {
                    this.$emit("update:expand", true);
                }, 500);
                if (!this.searchKey) {
                    setTimeout(() => {
                        this.$emit("update:showGuide", true);
                    }, 500);
                }
            } else {
                ipcRenderer.send("change-window", "small");
                this.$emit("fold");
                this.$emit("update:expand", false);
                this.$emit("update:showGuide", false);
            }
        },
        handleInput: _.debounce(function($event) {
            if (this.searchKey) {
                setTimeout(() => {
                    this.$emit("update:expand", true);
                }, 500);
                ipcRenderer.send("change-window", "large");
                this.$emit("search", $event.target.value);
                this.$emit("update:showGuide", false);
            } else {
                //如果有导航习惯，无搜索词时展示导航
                if (localStorage.getItem("show-guide")) {
                    this.$emit("update:showGuide", true);
                } else {
                    this.$emit("update:expand", false);
                    ipcRenderer.send("change-window", "small");
                }
                this.$emit("fold", true);
            }
        }, 300)
    }
};
</script>

<style lang="less"
    scoped>
.input-wrap {
    position: relative;

    .iconsearch,
    .iconzhankai {
        position: absolute;
        height: 100%;
        line-height: 45px;
        margin-left: 15px;
        font-size: 20px;
    }

    .iconzhankai {
        position: absolute;
        top: 0;
        right: 15px;
        font-size: 12px;
        height: auto;
        line-height: 42px;
        transition: all 0.3s;
        transform: rotate(180deg);
    }

    .rotate {
        transform: rotate(0);
    }

    .main-input {
        padding-left: 50px;
        border-bottom: 1px solid rgba(207, 215, 216, 0.47);
        margin-bottom: 0;

        &:focus {
            border-bottom: 1px solid rgba(167, 180, 204, 0.45) !important;
            box-shadow: none !important;
        }
    }

    .hiddden-input {
        position: absolute;
        border: none !important;
        top: 0;
        z-index: -1;
    }
}
</style>