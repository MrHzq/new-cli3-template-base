/*
 * @Author: hzq
 * @Date: 2019-07-08 10:36:47
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 10:22:47
 * @文件说明: 头部导航
 */
<template>
    <div v-show="showRouter" class='h-header-tabs'>
        <h-tabs :tabValue="currTabValue" :tabPane="tabPane" router/>
    </div>
</template>

<script>
    export default {
        name: 'h-header-tabs',
        data() {
            return {
                tabPane: [
                    {
                        name: '/mpset/basic',
                        label: '平台设置'
                    },
                    {
                        name: '/recharge',
                        label: '充值记录'
                    },
                    {
                        name: '/userlog',
                        label: '用户日志'
                    },
                    {
                        name: '/finance',
                        label: '财务明细'
                    },
                    {
                        name: '/user',
                        label: '用户管理'
                    }
                ]
            }
        },
        computed: {
            showRouter() {
                const f = this.tabPane.find(t => {
                    const tname = t.name.split('/')[1]
                    const rname = this.$route.path.split('/')[1]
                    return tname === rname
                })
                return f
            },
            currTabValue() {
                let f = this.showRouter
                if (!f) f = this.tabPane[0]
                return f.name
            }
        }
    }
</script>

<style lang='scss' scoped>
    .h-header-tabs {
        position: absolute;
        bottom: 0px;
        left: $asideWidth;
        & /deep/ .el-tabs__header {
            margin-bottom: 0;
        }
    }
</style>
