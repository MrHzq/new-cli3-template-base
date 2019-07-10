/*
 * @Author: hzq
 * @Date: 2019-07-01 10:55:56
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 15:53:01
 * @文件说明: 侧边栏组件
 */
<template>
    <div class='h-aside'>
        <el-menu :default-active="currActive" text-color="#666" @select="onSelect">
            <el-menu-item v-for="i in aside" :key="i.icon" :index="i.icon">
                <img :src="require('img/'+i.icon+(currActive===i.icon?'_click':'_noclick')+'.png')" alt="side-icon">
                <span slot="title" class="ml16">{{i.title}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'h-aside',
        inheritAttrs: false,
        data() {
            return {
                aside: [
                    { title: '平台设置', icon: 'mpset' },
                    { title: '活动管理', icon: 'act' },
                    { title: '投票管理', icon: 'vote' }
                ]
            }
        },
        computed: {
            currActive: {
                get() {
                    const r = this.$route.path.split('/')[1]
                    let f = this.aside.find(a => {
                        return !!r.match(a.icon)
                    })
                    if (!f) f = this.aside[0]
                    return f.icon
                },
                set(val) {
                    console.log(val)
                }
            }
        },
        methods: {
            onSelect(index) {
                this.currActive = index
                this.$to('/' + index)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .h-aside {
        position: fixed;
        top: 0;
        bottom: 0;
        width: $asideWidth;
        margin-top: 80px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 1px 0px 2px 0px #ececec;
        & /deep/ .el-menu {
            border-right: none;
            .el-menu-item {
                padding: 0 !important;
            }
        }
    }
</style>
