/*
 * @Author: hzq
 * @Date: 2019-07-01 10:55:56
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-10 10:17:23
 * @文件说明: 头部栏组件
 */
<template>
    <div class='h-header'>
        <div class="content mWidth flex-b">
            <div class="left">
                <span class="f18">投票管理平台</span>
            </div>
            <div v-if="$route.path!=='/login'" class="right">
                <h-dropdown :dropdown="dropdown" trigger="hover" class="c3" @command="onCommand">
                    <span class="mr5">{{$userinfo().UserName}}</span>
                </h-dropdown>

                <h-dialog :visible.sync="adminDialog" title="修改密码" width="500px" @closed="onClosed">
                    <h-form :model="adminForm" :rules="rules" :load="fload" refkey="adminForm" @cancel="adminDialog=false" @confirm="onConfirm">
                        <el-form-item label="用户名">
                            <span>{{$userinfo().UserName}}</span>
                        </el-form-item>
                        <el-form-item prop="Password" label="新密码">
                            <h-input v-model.trim="adminForm.Password" type="password" placeholder="请输入密码" maxlength="18" />
                        </el-form-item>
                        <el-form-item prop="RePassword" label="确认密码">
                            <h-input v-model.trim="adminForm.RePassword" type="password" placeholder="请输入确认密码" maxlength="18" />
                        </el-form-item>
                    </h-form>
                </h-dialog>
            </div>
            <h-header-tabs/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'h-header',
        inheritAttrs: false,
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
                dropdown: [
                    {
                        command: 'editpwd',
                        name: '修改密码'
                    },
                    {
                        command: 'logout',
                        name: '退出'
                    }
                ],
                // 是否显示 admin 弹窗
                adminDialog: false,
                // admin 表单数据
                adminForm: {
                    Id: 0,
                    Password: '',
                    RePassword: ''
                },
                // admin 原始表单数据
                emptyAdminForm: {
                    Id: 0,
                    Password: '',
                    RePassword: ''
                },
                // 表单验证规则
                rules: {
                    Password: [
                        this.$rules.required('请输入密码'),
                        this.$rules.Len()
                    ],
                    RePassword: [{ validator: checkRpPwd, trigger: 'change' }]
                },
                // 表单是否加载
                fload: false
            }
        },

        methods: {
            onCommand({ op }) {
                if (op === 'logout') {
                    this.$fedLogOut()
                } else {
                    this.adminForm.Id = this.$userinfo().Id
                    this.adminDialog = true
                }
            },
            // 表单确认事件：修改密码
            onConfirm() {
                this.$formRefs.adminForm.validate(valid => {
                    if (valid) {
                        this.fload = true
                        this.$api
                            .ResetVoteMpAdminUserPassword(this.adminForm)
                            .then(res => {
                                if (res.code === 1) {
                                    this.adminDialog = false
                                    this.$msg('修改成功', 1)
                                    this.onClosed('out')
                                }
                                this.fload = false
                            }, () => (this.fload = false))
                    }
                })
            },
            // 弹窗关闭，重置表单数据
            onClosed(type) {
                this.fload = false
                this.$formRefs.adminForm.resetFields()
                this.adminForm = this.$copy(this.emptyAdminForm)
                if (type === 'out') this.$fedLogOut()
            }
        }
    }
</script>

<style lang='scss' scoped>
    .h-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 1px 2px 0px #ececec;

        .content {
            position: relative;
            height: 80px;
        }
    }
</style>
