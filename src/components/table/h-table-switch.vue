/*
 * @Author: hzq
 * @Date: 2019-02-25 16:08:34
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-02 17:57:57
 * @文件说明: 表格+switch组件
 */
<template>
    <el-table-column :label="label" :align="$attrs.align||'center'">
        <template slot-scope="scope">
            <h-switch v-model="scope.row[prop]" :disabled="disabled" @change="$emit('change',scope)" />
        </template>
    </el-table-column>
</template>

<script>
    export default {
        name: 'h-table-switch',
        inheritAttrs: false,
        props: {
            prop: {
                type: String,
                default: 'IsTop'
            },
            label: {
                type: String,
                default: '置顶'
            },
            // switch 是否不可切换
            disabled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
