/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 14:34:40
 * @文件说明: 充值记录
 */
<template>
    <div class='recharge'>
        <tabs-with-filter :tabValue.sync="listParams.Status" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:statusOption}" :search="{placeholder:'请输入ID/订单号/用户名'}" @on-return="handelListParams">
            <h-select v-model="listParams.PayType" :option="payTypeOption" w="80" needAll="全部类型" class="ml30 c9" @change="handelListParams" />
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <el-table-column prop="Number" label="订单号" min-width="100" align="center" />
            <h-table-title prop="VoteMpUser.UserName" label="用户名" textTitle="点击筛选用户" iconTitle="点击查看用户" usericon @text-click="textClick" @icon-click="iconClick" />
            <h-table-price min-width="100" color="primary" />
            <h-table-select :option="payTypeOption" prop="PayType" label="类型" min-width="100" w="70" disabled />
            <h-table-select :option="statusOption" prop="Status" label="状态" min-width="100" w="70" disabled />
            <h-table-time />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetVoteMpRechargeLogList" />
    </div>
</template>

<script>
    export default {
        name: 'recharge',
        data() {
            return {
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Status: 0,
                    PayType: 0,
                    SearchKey: '',
                    VoteMpUserId: 0,
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-充值状态所有选项
                statusOption: [
                    {
                        value: 2,
                        label: '已付款',
                        colorClass: 'success'
                    },
                    {
                        value: 1,
                        label: '未付款',
                        colorClass: 'danger'
                    }
                ],
                // 表格-支付类型所有选项
                payTypeOption: [
                    {
                        label: '支付宝',
                        value: 1
                    },
                    {
                        label: '微信',
                        value: 2
                    },
                    {
                        label: '人工',
                        value: 3
                    }
                ]
            }
        },

        watch: {
            $route: {
                handler() {
                    // 获取地址上的 user id
                    this.listParams.VoteMpUserId = this.$id(this)
                    // 获取地址上的 Status
                    this.listParams.Status = this.$gquery(this, 'tab')
                    // 获取地址上的 page
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    this.GetVoteMpRechargeLogList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取充值明细列表
            GetVoteMpRechargeLogList() {
                this.tload = true
                this.$api.GetVoteMpRechargeLogList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteMpRechargeLogList')
            },
            // 用户名点击事件
            textClick(row) {
                this.$queryTo(this, 'id', row.VoteMpUser.Id)
            },
            // 用户icon点击事件
            iconClick(row) {
                this.$queryTo(this, 'id', row.VoteMpUser.Id, '/user')
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>
