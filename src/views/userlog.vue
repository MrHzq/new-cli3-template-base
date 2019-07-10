/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 14:02:45
 * @文件说明: 用户日志
 */
<template>
    <div class='userlog'>
        <tabs-with-filter :tabValue.sync="listParams.Type" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:typeOption}" :search="{placeholder:'请输入ID/用户名'}" @on-return="handelListParams" />
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <h-table-title prop="VoteMpUser.UserName" label="用户名" textTitle="点击筛选用户" iconTitle="点击查看用户" usericon @text-click="textClick" @icon-click="iconClick" />
            <h-table-select :option="typeOption" prop="Type" label="类型" width=" " disabled />
            <el-table-column prop="Ip" label="IP" align="center" />
            <el-table-column prop="Area" label="地区" align="center" />
            <h-table-time label="时间" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetVoteMpUserLogList" />
    </div>
</template>

<script>
    export default {
        name: 'userlog',
        data() {
            return {
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Type: 0,
                    SearchKey: '',
                    VoteMpUserId: 0,
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-充值状态所有选项
                typeOption: [
                    {
                        value: 1,
                        label: '登录',
                        colorClass: 'success'
                    },
                    {
                        value: 2,
                        label: '退出',
                        colorClass: 'danger'
                    }
                ]
            }
        },

        watch: {
            $route: {
                handler() {
                    // 获取地址上的 user id
                    this.listParams.VoteMpUserId = this.$id(this)
                    // 获取地址上的 Type
                    this.listParams.Type = this.$gquery(this, 'tab')
                    // 获取地址上的 PageIndex
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    this.GetVoteMpUserLogList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取充值明细列表
            GetVoteMpUserLogList() {
                this.tload = true
                this.$api.GetVoteMpUserLogList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteMpUserLogList')
            },
            // 用户名点击事件
            textClick(row) {
                this.$queryTo(this,'id', row.VoteMpUser.Id)
            },
            // 用户icon点击事件
            iconClick(row) {
                this.$queryTo(this,'id', row.VoteMpUser.Id, '/user')
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>
