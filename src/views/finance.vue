/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 14:36:52
 * @文件说明: 财务明细设置
 */
<template>
    <div class='finance'>
        <tabs-with-filter :tabValue.sync="listParams.Type" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:option}" :search="{placeholder:'请输入ID/用户名/备注'}" @on-return="handelListParams" />
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <h-table-title prop="VoteMpUser.UserName" label="用户名" min-width="110" textTitle="点击筛选用户" iconTitle="点击查看用户" usericon @text-click="textClick" @icon-click="iconClick" />
            <h-table-select :option="option" prop="Type" label="类型" min-width="100" disabled />
            <h-table-price min-width="100" />
            <h-table-price prop="Balance" label="余额" min-width="100" />
            <h-table-title prop="Remark" label="备注" min-width="250" textTitle="" overcol="2" opentip/>
            <h-table-time />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetVoteMpFinancialDetailList" />
    </div>
</template>

<script>
    export default {
        name: 'finance',
        data() {
            return {
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Type: 0,
                    VoteMpUserId: 0,
                    SearchKey: '',
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-财务类型所有选项
                option: [
                    {
                        value: 1,
                        label: '充值',
                        colorClass: 'success'
                    },
                    {
                        value: 2,
                        label: '消费',
                        colorClass: 'primary'
                    },
                    {
                        value: 3,
                        label: '退款',
                        colorClass: 'danger'
                    }
                ],
                // 金额（key:Money）的价格样式
                moneyStyle: {
                    2: { prefix: '-', color: 'danger' },
                    other: { prefix: '+', color: 'success' }
                }
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
                    this.GetVoteMpFinancialDetailList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取财务明细列表
            GetVoteMpFinancialDetailList() {
                this.tload = true
                this.$api
                    .GetVoteMpFinancialDetailList(this.listParams)
                    .then(res => {
                        if (res.code === 1) {
                            res.data.List.map(l => {
                                // 处理 金额（key:Money）的颜色那块
                                const ps = this.moneyStyle
                                let color = ''
                                let prefix = ''
                                if (ps[l.Type]) {
                                    prefix = ps[l.Type].prefix
                                    color = ps[l.Type].color
                                } else {
                                    prefix = ps.other.prefix
                                    color = ps.other.color
                                }
                                l.MoneyPrefix = prefix
                                if (color) {
                                    const colorObj = this.$color(color)
                                    l.MoneyColorClass = colorObj.class
                                    l.MoneyColorStyle = colorObj.style
                                }
                            })
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
