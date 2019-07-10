/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 14:54:39
 * @文件说明: 用户设置
 */
<template>
    <div class='user'>
        <tabs-with-filter :tabValue.sync="listParams.Status" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:statusOption,clearRouter:true}" :search="{w:260,placeholder:'请输入编号/用户名/手机号/QQ'}" @on-return="handelListParams">
            <h-button w="110" add @click="isadd=true,userDialog=true">新增用户</h-button>
            <h-select v-model="listParams.Sort" :option="sortOption" w="135" needAll="默认排序" class="ml30 c9" @change="handelListParams" />
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <h-table-title prop="UserName" label="用户名" @text-click="i=>onCommand({op:'edit',i})" />
            <el-table-column prop="Phone" label="手机号" align="center" width="113px" />
            <h-table-select :option="statusOption" @change="changeStatus" />
            <h-table-title prop="Balance" label="余额" textTitle="点击修改金额" color="primary" price @text-click="i=>onCommand({op:'money',i})" />
            <h-table-price prop="Consume" label="消费" width=" " />
            <h-table-title prop="TaskNum" label="全部订单" textTitle="点击查看订单" @text-click="i=>toVote(0,i)" />
            <h-table-title prop="GoingTaskNum" label="进行中订单" min-width="90" textTitle="点击查看订单" @text-click="i=>toVote(2,i)" />
            <h-table-time />
            <h-table-op :dropdown="dropdown" @command="onCommand" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" @change="GetVoteMpUserList" />
        <!-- 用户资料弹窗 -->
        <h-dialog :visible.sync="userDialog" :title="dialogTitle" width="500px" @closed="userDialogClosed">
            <h-form :model="userForm" :rules="userRules" :load="uload" refkey="userForm" @confirm="onUserConfirm" @cancel="userDialog=false">
                <el-form-item prop="UserName" label="用户名">
                    <h-input v-if="isadd" v-model.trim="userForm.UserName" placeholder="请输入用户名" maxlength="11" />
                    <span v-else>{{userForm.UserName}}</span>
                </el-form-item>
                <template v-if="isadd||iseditpwd">
                    <el-form-item prop="Password" :label="iseditpwd?'新密码':'密码'">
                        <h-input v-model.trim="userForm.Password" type="password" placeholder="请输入密码" maxlength="18" />
                    </el-form-item>
                    <el-form-item prop="RePassword" label="确认密码">
                        <h-input v-model.trim="userForm.RePassword" type="password" placeholder="请输入确认密码" maxlength="18" />
                    </el-form-item>
                </template>
                <template v-if="!iseditpwd">
                    <el-form-item prop="Phone" label="手机号">
                        <h-input v-model.trim="userForm.Phone" placeholder="请输入手机号" maxlength="11" />
                    </el-form-item>
                    <el-form-item prop="QQ" label="QQ">
                        <h-input v-model.trim="userForm.QQ" placeholder="请输入QQ" maxlength="11" />
                    </el-form-item>
                </template>
            </h-form>
        </h-dialog>
        <!-- 修改金额弹窗 -->
        <h-dialog :visible.sync="moneyDialog" title="修改金额" width="500px" @closed="moneyDialogClosed">
            <h-form :model="moneyForm" :rules="moneyRules" :load="mload" refkey="moneyForm" @confirm="onMoneyConfirm" @cancel="moneyDialog=false">
                <el-form-item label="用户名">
                    <span>{{moneyForm.UserName}}</span>
                </el-form-item>
                <el-form-item label="余额(元)">
                    <span>{{moneyForm.Balance}}</span>
                </el-form-item>
                <el-form-item label="类型">
                    <h-radio v-model="moneyForm.Type" :radios="moneyTypeArr" />
                </el-form-item>
                <el-form-item prop="Money" label="金额(元)">
                    <h-input v-model.trim="moneyForm.Money" placeholder="请输入金额" />
                </el-form-item>
                <el-form-item abel="备注">
                    <h-input v-model.trim="moneyForm.Remark" type="textarea" :rows="5" placeholder="请输入备注" maxlength="100" />
                </el-form-item>
            </h-form>
        </h-dialog>
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            // 二次密码确认 验证
            const checkRpPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'))
                } else if (value !== this.userForm.Password) {
                    callback(new Error('两次密码不一致'))
                } else callback()
            }
            return {
                // 排序方式数据
                sortOption: [
                    {
                        label: '按余额倒序',
                        value: 1
                    },
                    {
                        label: '按消费倒序',
                        value: 2
                    },
                    {
                        label: '按订单倒序',
                        value: 4
                    },
                    {
                        label: '按进行中订单倒序',
                        value: 5
                    }
                ],
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Sort: 0,
                    Status: 0,
                    PageIndex: 1,
                    SearchKey: '',
                    VoteMpUserId: 0,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-状态所有选项
                statusOption: [
                    {
                        value: 1,
                        label: '正常'
                    },
                    {
                        value: 2,
                        label: '禁用',
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
                        command: 'pwd',
                        name: '修改密码'
                    },
                    {
                        command: 'money',
                        name: '修改金额'
                    },
                    {
                        command: 'finance',
                        name: '财务明细'
                    },
                    {
                        command: 'userlog',
                        name: '用户日志'
                    },
                    {
                        command: 'del',
                        name: '删除'
                    }
                ],
                // 是否显示user弹窗
                userDialog: false,
                // user弹窗标题
                dialogTitle: '新增用户',
                // user弹窗是否为新增
                isadd: true,
                // user弹窗是否为编辑密码
                iseditpwd: false,
                // user 表单数据
                userForm: {
                    UserName: '',
                    Password: '',
                    RePassword: '',
                    Phone: '',
                    QQ: ''
                },
                // 空的 user 表单数据
                emptyUserForm: {
                    UserName: '',
                    Password: '',
                    RePassword: '',
                    Phone: '',
                    QQ: ''
                },
                // user弹窗表单验证规则
                userRules: {
                    UserName: [
                        this.$rules.required('请输入用户名'),
                        this.$rules.EnAndNum('只能输入英文和数字')
                    ],
                    Password: [
                         this.$rules.required('请输入密码'),
                        this.$rules.Len()
                    ],
                    RePassword: [{ validator: checkRpPwd, trigger: 'change' }],
                    Phone: [this.$rules.Phone()],
                    QQ: [this.$rules.QQ()]
                },
                // user弹窗表单是否加载
                uload: false,
                // 是否显示money弹窗
                moneyDialog: false,
                // money 表单数据
                moneyForm: {
                    Money: '',
                    Type: 1,
                    Remark: ''
                },
                // 空的 money 表单数据
                emptyMoneyForm: {
                    Money: '',
                    Type: 1,
                    Remark: ''
                },
                // 修改金额类型
                moneyTypeArr: [
                    {
                        label: 1,
                        name: '充值'
                    },
                    {
                        label: 2,
                        name: '消费'
                    },
                    {
                        label: 3,
                        name: '退款'
                    }
                ],
                // money弹窗表单验证规则
                moneyRules: {
                    Money: [
                        this.$rules.required('请输入金额'),
                        this.$rules.Number('只能输入数字')
                    ]
                },
                // money弹窗表单是否加载
                mload: false
            }
        },

        watch: {
            $route: {
                handler() {
                    // 获取地址上的 user id
                    this.listParams.VoteMpUserId = this.$id(this)
                    // 获取地址上的 Status
                    this.listParams.Status = this.$gquery(this, 'tab')
                    // 获取地址上的 PageIndex
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    // 获取用户列表
                    this.GetVoteMpUserList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取用户列表
            GetVoteMpUserList() {
                this.tload = true
                this.$api.GetVoteMpUserList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 用户资料表单确认事件：新增||编辑用户
            onUserConfirm() {
                this.$formRefs.userForm.validate(valid => {
                    if (valid) {
                        this.uload = true
                        let key = this.isadd ? 'AddVoteMpUser' : 'UpdateVoteMpUser'
                        if (this.iseditpwd) key = 'ResetVoteMpUserPassword'
                        this.$api[key](this.userForm).then(res => {
                            if (res.code === 1) {
                                this.userDialog = false
                                this.$msg(this.isadd ? '新增成功' : '编辑成功', 1)
                                if (this.isadd) {
                                    // 清空查询条件
                                    this.listParams.SearchKey = ''
                                    if (
                                        this.listParams.PageIndex === 1 &&
                                        this.listParams.Status === 0
                                    ) {
                                        // 当 处于 【全部、第一页】时，就重新调接口更新数据
                                        this.GetVoteMpAdminUserList()
                                    } else {
                                        // 否则 就跳转到【全部、第一页】
                                        this.$queryTo(this, 'tab', 0)
                                    }
                                } else this.GetVoteMpUserList()
                            }
                            this.uload = false
                        }, () => (this.uload = false))
                    }
                })
            },

            // 资料弹窗关闭，重置表单数据
            userDialogClosed() {
                this.dialogTitle = '新增用户'
                this.iseditpwd = false
                this.uload = false
                this.$formRefs.userForm.resetFields()
                this.userForm = this.$copy(this.emptyUserForm)
            },
            // 修改金额表单确认事件
            onMoneyConfirm() {
                this.$formRefs.moneyForm.validate(valid => {
                    if (valid) {
                        this.mload = true
                        this.$api
                            .UpdateVoteMpUserMoney(this.moneyForm)
                            .then(res => {
                                if (res.code === 1) {
                                    this.moneyDialog = false
                                    this.$msg('修改成功', 1)
                                    this.GetVoteMpUserList()
                                }
                                this.mload = false
                            }, () => (this.mload = false))
                    }
                })
            },
            // 修改金额弹窗关闭，重置表单数据
            moneyDialogClosed() {
                this.$formRefs.moneyForm.resetFields()
                this.moneyForm = this.$copy(this.emptyMoneyForm)
            },
            // 更改表单正常、禁用状态
            changeStatus({ row }) {
                this.$api.UpdateVoteMpUserStatus(row).then(res => {
                    if (res.code === 1) {
                        this.$msg('修改成功', 1)
                        if (this.listParams.Status) this.handelListParams()
                    }
                })
            },
            // 表单操作事件
            onCommand({ op, i }) {
                if (op === 'del') {
                    this.$del().then(
                        () => {
                            this.$api.DelVoteMpUser({ Id: i.Id }).then(res => {
                                if (res.code === 1) {
                                    this.$msg('删除成功', 1)
                                    this.handelListParams()
                                }
                            })
                        },
                        () => {}
                    )
                } else if (op === 'money') {
                    this.moneyForm = Object.assign(this.moneyForm, this.$copy(i))
                    this.moneyDialog = true
                } else if (op === 'finance') {
                    this.$to(op, { id: i.Id })
                } else if (op === 'userlog') {
                    this.$to(op, { id: i.Id })
                } else {
                    this.isadd = false
                    this.iseditpwd = op === 'pwd'
                    this.dialogTitle = this.iseditpwd ? '修改密码' : '编辑用户'
                    this.userForm = this.$copy(i)
                    this.userDialog = true
                }
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteMpUserList')
            },
            // 订单点击事件
            toVote(type, row) {
                this.$to('/vote', { tab: type, id: row.Id })
            }
        }
    }
</script>

<style lang='scss' scoped></style>
