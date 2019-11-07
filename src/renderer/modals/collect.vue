<template>
    <div>
        <div class="mask"
            @click="$emit('update:visible',false)"
            v-if="visible"></div>
        <transition name="fade">
            <div v-if="visible"
                class="modal">
                <div class="modal-content">
                    <h4>添加收藏</h4>
                    <div style="height: 1px;"></div>
                    <div class="input-field">
                        <input v-model="form.name"
                            placeholder="请输入网页标题"
                            type="text"
                            class="validate">
                        <label for="first_name"
                            class="active">标题</label>
                    </div>
                    <div class="input-field">
                        <input v-model="form.url"
                            placeholder="请输入网页URL"
                            type="text"
                            class="validate">
                        <label for="first_name"
                            class="active">网址</label>
                    </div>
                    <div class="input-field">
                        <input v-model="form.icon"
                            placeholder="请输入图标地址"
                            type="text"
                            class="validate">
                        <label for="first_name"
                            class="active">ICON</label>
                    </div>
                    <div class="input-field">
                        <input v-model="form.keyWords"
                            placeholder="请输入网页关键词，英文逗号分割"
                            type="text"
                            class="validate">
                        <label for="first_name"
                            class="active">关键词</label>
                    </div>
                    <div class="input-field">
                        <input v-model="form.desc"
                            placeholder="请输入网页描述"
                            type="text"
                            class="validate">
                        <label for="first_name"
                            class="active">描述</label>
                    </div>
                    <div class="input-field select">
                        <select class="browser-default"
                            v-model="form.type">
                            <option value="insert">内嵌</option>
                            <option value="blank">浏览器打开</option>
                        </select>
                        <label class="active">类型</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <a @click="collectItem"
                        class=" modal-action modal-close waves-effect waves-green btn-flat">确认</a>
                </div>
            </div>
        </transition>
    </div>

</template>
<script>
/**
 * @note
 * @author chengzhenyu@corp.netease.com
 * @date 代码片段生成
 * @Last Modified by: chengzhenyu@corp.netease.com
 * @Last Modified time: 2019-11-07 23:52:12
 */
import { ipcRenderer } from "electron";

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        iframe: {
            type: Object
        }
    },
    data() {
        return {
            form: {
                url: this.iframe.url || '',
                name: this.iframe.name || '',
                keyWords: this.iframe.keyWords || '',
                type: this.iframe.type || 'blank', // 跳转默认浏览器打开
                desc: this.iframe.desc || '',
                icon: this.iframe.icon || ''
            }
        }
    },
    watch: {
        // iframe 发生变化，重置
        iframe: {
            handler(newName, oldName) {
                this.form = {
                    url: this.iframe.url || '',
                    name: this.iframe.name || '',
                    keyWords: this.iframe.keyWords || '',
                    type: this.iframe.type || 'blank', // 跳转默认浏览器打开
                    desc: this.iframe.desc || '',
                    icon: this.iframe.icon || ''
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        collectItem() {
            ipcRenderer.send("collect-item", this.form);
        }
    },
}
</script>

<style lang="less"
    scoped>
.modal {
    display: block;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
}

.active {
    left: 0 !important;
}

.select {
    select {
        margin-top: 30px;
    }

    label {
        top: -10px;
    }
}

.modal {
    max-height: 100%;
}
</style>