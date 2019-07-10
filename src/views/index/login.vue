/*
 * @Author: hzq
 * @Date: 2019-06-28 15:06:51
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-10 09:55:36
 * @文件说明: 登录表单
 */
<template>
    <h-form class='login-form' :model="login" :rules="rules" :load="btnLoad" :cancelBtn="false" refkey="loginForm" label-width="0px" confirmBtnText="登录" confirmBtnWidth="100%" @confirm="onLogin">
        <el-form-item prop="UserName">
            <h-input v-model.trim="login.UserName" placeholder="请输入用户名" maxlength="11">
                <img slot="prefix" class="mt9" src="~img/mine.png" alt="mine">
            </h-input>
        </el-form-item>
        <el-form-item prop="Password">
            <h-input v-model.trim="login.Password" type="password" placeholder="请输入密码" maxlength="18">
                <img slot="prefix" class="mt9" src="~img/lock.png" alt="lock">
            </h-input>
        </el-form-item>
        <el-form-item prop="Captcha" class="mb40">
            <h-input v-model.trim="login.Captcha" placeholder="请输入验证码" maxlength="4">
                <img slot="prefix" class="mt10" src="~img/verification.png" alt="verification">
                <template slot="suffix">
                    <img v-if="captchaImg" :src="captchaImg" class="suffix-img mt5 cursor" alt="suffix-img" @click="GetImageCaptcha" />
                    <i v-else class="el-icon-loading" />
                </template>
            </h-input>
        </el-form-item>
    </h-form>
</template>

<script>
    export default {
        name: 'login-form',
        data() {
            return {
                // 图形验证码 base64 地址
                captchaImg: '',
                // 图形验证码Token
                captchaId: '',
                // 登录数据
                login: { UserName: 'admin', Password: '123456', Captcha: '' },
                // 登录表单验证规则
                rules: {
                    UserName: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'change'
                        }
                    ],
                    Password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'change'
                        },
                        {
                            min: 6,
                            max: 18,
                            message: '密码长度为 6 到 18 位',
                            trigger: 'blur'
                        }
                    ],
                    Captcha: [
                        {
                            required: true,
                            message: '请输入验证码',
                            trigger: 'change'
                        },
                        {
                            min: 4,
                            max: 4,
                            message: '长度为 4 个字符',
                            trigger: 'blur'
                        }
                    ]
                },
                // 登录按钮loading效果
                btnLoad: false
            }
        },
        created() {
            this.$clearItem()
            this.$removeToken()
            // 获取验证码图片
            this.GetImageCaptcha()
        },
        methods: {
            // 获取验证码图片
            GetImageCaptcha() {
                this.captchaImg = ''
                this.login.Captcha = ''
                this.$api.GetImageCaptcha().then(res => {
                    if (res.code === 1) {
                        this.captchaImg = res.data.ImageData
                        this.captchaId = res.data.CaptchaId
                    }
                })
            },
            // 登录
            onLogin() {
                if (this.captchaImg) {
                    this.$formRefs.loginForm.validate(valid => {
                        if (valid) {
                            this.btnLoad = true
                            this.$api
                                .Login({
                                    ...this.login,
                                    CaptchaId: this.captchaId
                                })
                                .then(res => {
                                    if (res.code === 1) {
                                        const { Token } = res.data
                                        this.$setToken(Token)
                                        return this.$api.GetVoteMpAdminUserInfo()
                                    }
                                    this.btnLoad = false
                                })
                                .then(res => {
                                    if (res.code === 1) {
                                        this.$store.commit('save', [
                                            'userInfo',
                                            res.data
                                        ])
                                        this.$to('/mpset')
                                    }
                                    this.btnLoad = false
                                })
                                .catch(() => (this.btnLoad = false))
                        }
                    })
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .login-form {
        & /deep/ .el-form-item {
            .h-input {
                .el-input__inner {
                    border-width: 0 0 1px 0;
                    padding-left: 45px;
                    @extend .bdr0;
                }
            }
            .suffix-img {
                height: 30px;
            }
        }
    }
</style>
