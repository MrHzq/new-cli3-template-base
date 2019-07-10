/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 18:47:00
 * @文件说明: 管理员设置
 */
<template>
    <div class='admin'>
        <tabs-with-filter :tabValue.sync="listParams.Status" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:statusOption}" :search="{placeholder:'请输入ID/用户名/手机号/QQ'}" @on-return="handelListParams">
            <h-button w="110" add @click="isadd=true,adminDialog=true">新增管理员</h-button>
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <h-table-title prop="UserName" label="用户名" @text-click="i=>onCommand({op:'edit',i})" />
            <h-table-select :option="roleTypeOption" prop="RoleType" label="类型" min-width="100" w="80" disabled @change="changeStatus" />
            <el-table-column prop="Phone" label="手机号" min-width="115" align="center" />
            <el-table-column prop="QQ" label="QQ" min-width="110" align="center" />
            <h-table-select :option="statusOption" @change="changeStatus" />
            <h-table-time />
            <h-table-op :dropdown="dropdown" @command="onCommand" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" />
        <h-dialog :visible.sync="adminDialog" :title="dialogTitle" width="500px" @closed="onClosed">
            <h-form :model="adminForm" :rules="rules" :load="fload" refkey="adminForm" @cancel="adminDialog=false" @confirm="onConfirm">
                <el-form-item prop="UserName" label="用户名">
                    <h-input v-if="isadd" v-model.trim="adminForm.UserName" placeholder="请输入用户名" maxlength="11" />
                    <span v-else>{{adminForm.UserName}}</span>
                </el-form-item>
                 <template v-if="!iseditpwd">
                <el-form-item label="类型">
                    <h-radio v-model="adminForm.RoleType" :radios="radios" />
                </el-form-item>
                </template>
                <template v-if="isadd||iseditpwd">
                    <el-form-item prop="Password" :label="iseditpwd?'新密码':'密码'">
                        <h-input v-model.trim="adminForm.Password" type="password" placeholder="请输入密码" maxlength="18" />
                    </el-form-item>
                    <el-form-item prop="RePassword" label="确认密码">
                        <h-input v-model.trim="adminForm.RePassword" type="password" placeholder="请输入确认密码" maxlength="18" />
                    </el-form-item>
                </template>
                <template v-if="!iseditpwd">
                    <el-form-item prop="Phone" label="手机号">
                        <h-input v-model.trim="adminForm.Phone" placeholder="请输入手机号" maxlength="11" />
                    </el-form-item>
                    <el-form-item prop="QQ" label="QQ">
                        <h-input v-model.trim="adminForm.QQ" placeholder="请输入QQ" maxlength="11" />
                    </el-form-item>
                </template>
            </h-form>
        </h-dialog>
    </div>
</template>

<script>
    export default {
        name: 'admin',
        data() {
            // 二次密码确认 验证
            const checkRpPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'))
                } else if (value !== this.adminForm.Password) {
                    callback(new Error('两次密码不一致'))
                } else callback()
            }
            return {
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    Status: 0,
                    SearchKey: '',
                    PageIndex: 1,
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
                // 表格-角色类型所有选项
                roleTypeOption: [
                    {
                        value: 1,
                        label: '超级管理员',
                        colorClass: 'danger'
                    },
                    {
                        value: 2,
                        label: '普通管理员'
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
                        command: 'del',
                        name: '删除'
                    }
                ],
                // 是否显示admin弹窗
                adminDialog: false,
                // 弹窗标题
                dialogTitle: '新增管理员',
                // 是否为新增
                isadd: true,
                // 是否为编辑密码
                iseditpwd: false,
                // admin 表单数据
                adminForm: {
                    UserName: '',
                    Password: '',
                    RePassword: '',
                    RoleType: 1,
                    Phone: '',
                    QQ: ''
                },
                // 空的 admin 表单数据
                emptyAdminForm: {
                    UserName: '',
                    Password: '',
                    RePassword: '',
                    RoleType: 1,
                    Phone: '',
                    QQ: ''
                },
                // 表单验证规则
                rules: {
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
                // 表单是否加载
                fload: false
            }
        },
        computed: {
            radios() {
                return this.roleTypeOption.map(r => {
                    return { label: r.value, name: r.label }
                })
            }
        },
        watch: {
            $route: {
                handler() {
                    // 获取地址上的 Status
                    this.listParams.Status = this.$gquery(this, 'tab')
                    // 获取地址上的 PageIndex
                    this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                    this.GetVoteMpAdminUserList()
                },
                immediate: true
            }
        },
        methods: {
            // 获取管理员列表
            GetVoteMpAdminUserList() {
                this.tload = true
                this.$api.GetVoteMpAdminUserList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 表单确认事件：新增||编辑管理员
            onConfirm() {
                this.$formRefs.adminForm.validate(valid => {
                    if (valid) {
                        this.fload = true
                        let key = this.isadd
                            ? 'AddVoteMpAdminUser'
                            : 'UpdateVoteMpAdminUser'
                        if (this.iseditpwd) key = 'ResetVoteMpAdminUserPassword'
                        this.$api[key](this.adminForm).then(res => {
                            if (res.code === 1) {
                                this.adminDialog = false
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
                                } else this.GetVoteMpAdminUserList()
                            }
                            this.fload = false
                        }, () => (this.fload = false))
                    }
                })
            },
            // 弹窗关闭，重置表单数据
            onClosed() {
                this.dialogTitle = '新增管理员'
                this.iseditpwd = false
                this.fload = false
                this.$formRefs.adminForm.resetFields()
                this.adminForm = this.$copy(this.emptyAdminForm)
            },
            // 更改表单正常、禁用状态
            changeStatus({ row }) {
                this.$api.UpdateVoteMpAdminUserStatus(row).then(res => {
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
                    this.isadd = false
                    this.iseditpwd = op === 'pwd'
                    this.dialogTitle = this.iseditpwd ? '修改密码' : '编辑管理员'
                    this.adminForm = this.$copy(i)
                    this.adminDialog = true
                }
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteMpAdminUserList')
            }
        }
    }
</script>

<style lang='scss' scoped></style>
