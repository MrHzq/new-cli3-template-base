/*
 * @Author: hzq
 * @Date: 2019-01-17 15:27:57
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-02 13:42:26
 * @文件说明: 二级标题组件
 */
<template>
    <div class='h-collapse' :class="{line:line}">
        <el-collapse :value="close?'0':'1'">
            <el-collapse-item :title="title" name="1">
                <slot/>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: 'h-collapse',
        inheritAttrs: false,
        props: {
            title: {
                type: String,
                default: '二级标题'
            },
            close: {
                type: Boolean,
                default: false
            },
            line: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang='scss' scoped>
    .h-collapse {
        & /deep/.el-collapse {
            border-top: none;
            border-bottom: none;
            .el-collapse-item__header {
                height: 48px;
                line-height: 48px;
                margin-bottom: 10px;
                font-size: 15px;
                letter-spacing: 1px;
                border-bottom: none;
                .el-collapse-item__arrow {
                    margin: 0;
                    margin-left: 10px;
                }
            }
            .is-active {
                color: $primary;
            }
            .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                    padding-bottom: 0;
                }
            }
        }
    }
    .line {
        & /deep/.el-collapse {
            .el-collapse-item__header {
                border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            }
        }
    }
</style>
