/*
 * @Author: hzq
 * @Date: 2019-07-02 13:42:13
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-02 18:00:21
 * @文件说明: 时间选择器组件
 */
<template>
    <el-date-picker v-model="dateVal" :type="type" :clearable="false" :editable="false" v-bind="$attrs" v-on="listeners" />
</template>

<script>
    export default {
        name: 'h-date-picker',
        inheritAttrs: false,
        model: { event: 'change' },
        props: {
            // 传入的数据
            value: {
                type: [Date, Array, String],
                default() {
                    return new Date()
                }
            },
            // 类型
            type: {
                type: String,
                default: 'datetime'
            }
        },
        computed: {
            dateVal: {
                get() {
                    return this.$fdate(this.value)
                },
                set(dateVal) {
                    this.$emit('change', this.$fdate(dateVal))
                }
            },
            listeners() {
                return { ...this.$listeners }
            }
        }
    }
</script>

<style lang='scss' scoped></style>
