/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 15:21:42
 * @文件说明: 活动管理
 */
<template>
    <div class='act'>
        <tabs-with-filter :tabValue.sync="listParams.Status" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:statusOption}" :search="{placeholder:'请输入ID/订单号/用户名'}" @on-return="handelListParams">
            <h-select v-model="listParams.ShowType" :option="topShowTypeOption" w="80" class="ml30 c9" needAll="全部状态" @change="handelListParams" />
            <h-select v-model="listParams.Kind" :option="kindOption" w="80" class="ml30 c9" needAll="全部类型" @change="handelListParams" />
            <h-select v-model="listParams.SortType" :option="sortTypeOption" w="80" class="ml30 c9" needAll="默认排序" @change="handelListParams" />
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <el-table-column label="活动名称" min-width="300" align="center">
                <template slot-scope="scope">
                    <div class="ellipsis1" :title="scope.row.Name">{{scope.row.Name}}</div>
                    <div class="flex-c">
                        <div>
                            <i class="el-icon-user" />
                            <span class="mr15">{{scope.row.VoteItemNum}}</span>
                        </div>
                        <div>
                            <i class="el-icon-medal" />
                            <span class="mr15">{{scope.row.VoteNum}}</span>
                        </div>
                        <span>结束时间:{{scope.row.EndTime}}</span>
                    </div>
                </template>
            </el-table-column>
            <h-table-title prop="OrderNum" label="订单" min-width="90" textTitle="点击查看订单" @text-click="toVote" />
            <h-table-title prop="VotePrice" label="单价(分)" min-width="90" textTitle="点击修改单价" @text-click="i=>onCommand({op:'edit',i})" />
            <h-table-select :option="kindOption" prop="Kind" label="类型" min-width="90" w="70" disabled />
            <h-table-select :option="showTypeOption" prop="IsShow" label="显示" min-width="90" @change="scope=>tableChange(scope.row)" />
            <h-table-select :option="statusOption" prop="Status" label="状态" min-width="90" w="70" disabled />
            <el-table-column prop="OrderRemark" label="备注" min-width="300" align="center" />
            <h-table-op @command="onCommand" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetActivityList" />
        <!-- 修改活动弹窗 -->
        <h-dialog :visible.sync="actDialog" title="编辑活动" width="500px" @closed="actDialogClosed">
            <h-form :model="actForm" :rules="actRules" :load="aload" refkey="actForm" @confirm="onActConfirm" @cancel="actDialog=false">
                <el-form-item label="用户名">
                    <span>{{actForm.Name}}</span>
                </el-form-item>
                <el-form-item prop="VotePrice" label="单价(分)">
                    <h-input v-model.trim.number="actForm.VotePrice" placeholder="请输入金额" maxlength="4" />
                </el-form-item>
                <el-form-item label="备注">
                    <h-input v-model.trim="actForm.OrderRemark" type="textarea" :rows="5" placeholder="请输入备注" maxlength="100" />
                </el-form-item>
            </h-form>
        </h-dialog>
    </div>
</template>

<script>
    export default {
        name: 'act',
        data() {
            return {
                // 顶部-显示所有选项
                topShowTypeOption: [
                    {
                        label: '显示',
                        value: 1
                    },
                    {
                        label: '隐藏',
                        value: 2
                    }
                ],
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
                    Kind: 0,
                    ShowType: 0,
                    SortType: 0,
                    SearchKey: '',
                    ActivityId: 0,
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-类型所有选项
                kindOption: [
                    {
                        value: 1,
                        label: '直投'
                    },
                    {
                        value: 2,
                        label: '关注',
                        colorClass: 'c3'
                    }
                ],
                // 表格-活动状态所有选项
                statusOption: [
                    {
                        value: 2,
                        label: '进行中',
                        colorClass: 'success'
                    },
                    {
                        value: 3,
                        label: '已结束',
                        colorClass: 'danger'
                    }
                ],
                // 表格-显示所有选项
                showTypeOption: [
                    {
                        label: '显示',
                        value: true
                    },
                    {
                        label: '隐藏',
                        value: false
                    }
                ],
                // 是否显示act弹窗
                actDialog: false,
                // act 表单数据
                actForm: {
                    Name: '',
                    VotePrice: '',
                    OrderRemark: ''
                },
                // 空的 act 表单数据
                emptyVotePriceForm: {
                    Name: '',
                    VotePrice: '',
                    OrderRemark: ''
                },
                // act弹窗表单验证规则
                actRules: {
                    VotePrice: [
                        this.$rules.required('请输入金额'),
                        this.$rules.Number('只能输入数字')
                    ]
                },
                // act弹窗表单是否加载
                aload: false
            }
        },

        watch: {
            $route: {
                handler() {
                    // 获取地址上的 user id
                    this.listParams.ActivityId = this.$id(this)
                    // 获取地址上的 Status
                    this.listParams.Status = this.$gquery(this, 'tab')
                    // 获取地址上的 page
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    this.GetActivityList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取活动管理列表
            GetActivityList() {
                this.tload = true
                this.$api.GetActivityList(this.listParams).then(res => {
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
                    this.$del().then(
                        () => {
                            this.$api.DelVoteMpAdminUser({ Id: i.Id }).then(res => {
                                if (res.code === 1) {
                                    this.$msg('删除成功', 1)
                                    this.handelListParams()
                                }
                            })
                        },
                        () => {}
                    )
                } else {
                    this.actForm = Object.assign(this.actForm, this.$copy(i))
                    this.actDialog = true
                }
            },
            // 修改金额表单确认事件
            onActConfirm() {
                this.$formRefs.actForm.validate(valid => {
                    if (valid) {
                        this.aload = true
                        this.$api.UpdateActivity(this.actForm).then(res => {
                            if (res.code === 1) {
                                this.actDialog = false
                                this.$msg('修改成功', 1)
                                this.GetActivityList()
                            }
                            this.aload = false
                        }, () => (this.aload = false))
                    }
                })
            },
            // 修改金额弹窗关闭，重置表单数据
            actDialogClosed() {
                this.$formRefs.actForm.resetFields()
                this.actForm = this.$copy(this.emptyActForm)
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetActivityList')
            },
            // 更改表单显示、隐藏状态
            tableChange(row) {
                this.$api.UpdateActivityShow(row).then(res => {
                    if (res.code === 1) {
                        this.$msg('修改成功', 1)
                        if (this.listParams.ShowType) {
                            this.handelListParams()
                        }
                    }
                })
            },
            // 订单点击事件
            toVote(row) {
                this.$to('/vote', { actid: row.Id })
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>
