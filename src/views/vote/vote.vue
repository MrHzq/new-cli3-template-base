/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 16:02:56
 * @文件说明: 投票管理
 */
<template>
    <div class='vote'>
        <tabs-with-filter :tabValue.sync="listParams.Status" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:statusOption}" :search="{placeholder:'请输入ID/订单号/用户名'}" @on-return="handelListParams">
            <!-- <h-select v-model="listParams.ShowType" :option="showTypeOption" w="80" class="ml30 c9" placeholder="显示状态" needAll @change="handelListParams" /> -->
            <!-- <h-select v-model="listParams.SortType" :option="sortTypeOption" w="80" class="ml30 c9" placeholder="排序方式" needAll @change="handelListParams" /> -->
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <el-table-column prop="Number" width="110px" label="订单编号" align="center" />
            <h-table-title prop="VoteMpUser.UserName" label="用户名" width="140px" textTitle="点击筛选用户" iconTitle="点击查看用户" usericon @text-click="textClick" @icon-click="iconClick" />
            <h-table-title prop="Activity.Name" label="活动名称" min-width="140" textTitle="点击查看活动" overcol="2" opentip @text-click="toAct" />
            <h-table-title prop="VoteItems" label="投票对象" min-width="100" textTitle="点击编辑任务" overcol="2" opentip @text-click="i=>onCommand({op:'edit',i})" />
            <el-table-column label="增长票数" width="100px" align="center">
                <template slot-scope="scope">
                    {{scope.row.VoteTask.VoteGapMin}}~{{scope.row.VoteTask.VoteGapMax}}
                </template>
            </el-table-column>
            <el-table-column label="投票间隔(s)" width="100px" align="center">
                <template slot-scope="scope">
                    {{scope.row.VoteTask.IcrPerTimeMin}}~{{scope.row.VoteTask.IcrPerTimeMax}}
                </template>
            </el-table-column>
            <el-table-column label="进度" width="100px" align="center">
                <template slot-scope="scope">
                    {{scope.row.VoteTask.VoteNumNow}}/{{scope.row.VoteTask.VoteNumNeed}}
                </template>
            </el-table-column>
            <el-table-column prop="Price" label="单价(分)" width="75" align="center" />
            <h-table-price prop="Money" label="金额" width="120" color="primary" />
            <h-table-select :option="statusOption" width="75" w="45" disabled />
            <h-table-time label="下单时间" />
            <h-table-op :dropdown="dropdown" @command="onCommand" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetVoteOrderList" />
    </div>
</template>

<script>
    export default {
        name: 'vote',
        data() {
            return {
                // 顶部-排序方式所有选项
                sortTypeOption: [
                    {
                        label: '时间倒序',
                        value: 1
                    },
                    {
                        label: '订单倒序',
                        value: 2
                    },
                    {
                        label: '票数倒序',
                        value: 3
                    },
                    {
                        label: '选手倒序',
                        value: 4
                    },
                    {
                        label: '访问量倒序',
                        value: 5
                    }
                ],
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Status: 0,
                    VoteMpUserId: 0,
                    ActivityId: 0,
                    SearchKey: '',
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-投票状态所有选项
                statusOption: [
                    // {
                    //     value: 0,
                    //     label: '错误状态',
                    //     colorClass: 'danger'
                    // },
                    {
                        value: 1,
                        label: '未开始',
                        colorClass: 'primary'
                    },
                    {
                        value: 2,
                        label: '进行中',
                        colorClass: 'success'
                    },
                    {
                        value: 3,
                        label: '已结束',
                        colorClass: 'info'
                    },
                    {
                        value: 4,
                        label: '已退款',
                        colorClass: 'danger'
                    }
                ],
                // 表格-操作所有选项
                dropdown: [
                    {
                        command: 'edit',
                        name: '编辑'
                    },
                    {
                        command: 'refund',
                        name: '退款'
                    },
                    {
                        command: 'add',
                        name: '补票'
                    },
                    {
                        command: 'del',
                        name: '删除'
                    }
                ]
            }
        },

        watch: {
            $route: {
                handler() {
                    // 获取地址上的 user id
                    this.listParams.VoteMpUserId = this.$id(this)
                    // 获取地址上的 act id
                    this.listParams.ActivityId = this.$gquery(this, 'actid')
                    // 获取地址上的 Status
                    this.listParams.Status = this.$gquery(this, 'tab')
                    // 获取地址上的 page
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    this.GetVoteOrderList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取投票管理列表
            GetVoteOrderList() {
                this.tload = true
                this.$api.GetVoteOrderList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 表单操作事件
            onCommand({ op, i }) {
                if (op === 'del') {
                    // this.$del().then(
                    //     () => {
                    //         this.$api.DelVoteMpAdminUser({ Id: i.Id }).then(res => {
                    //             if (res.code === 1) {
                    //                 this.$msg('删除成功', 1)
                    //                 this.handelListParams()
                    //             }
                    //         })
                    //     },
                    //     () => {}
                    // )
                } else {
                    if (op === 'refund' && i.Status < 3) {
                        return this.$msg('订单未结束，不能退款')
                    }
                    this.$to('/vote-' + op, { id: i.Id, taskid: i.VoteTask.Id })
                }
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteOrderList')
            },
            // 活动名称点击事件
            toAct(row) {
                this.$to('/act', { id: row.ActivityId })
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
