/*
 * @Author: hzq
 * @Date: 2019-01-25 10:01:21
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-02 17:58:48
 * @文件说明: 基于el-button封装的按钮
 */
<template>
    <!-- 【新增按钮】样式 -->
    <el-button v-if="add" class="h-button" :style="style" icon="el-icon-plus" type="primary" v-bind="$attrs" v-on="listeners">
        <slot/>
    </el-button>
    <!-- 【普通按钮】样式 -->
    <el-button v-else class="h-button" :style="style" v-bind="$attrs" v-on="listeners">
        <slot/>
    </el-button>
</template>

<script>
    export default {
        name: 'h-button',
        inheritAttrs: false,
        props: {
            // 宽度
            w: {
                type: String,
                default: '98'
            },
            // 高度
            h: {
                type: String,
                default: '40'
            },
            // 跳转的路由
            to: {
                type: String,
                default: ''
            },
            // 是否为新增操作的按钮
            add: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    click: () => {
                        if (this.to) this.$to(this.to)
                        this.$emit('click')
                    }
                }
            },
            style() {
                return {
                    height: this.h + 'px',
                    width: this.$px(this.w)
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .h-button {
        padding: 0;
    }
</style>
