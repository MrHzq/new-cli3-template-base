/*
 * @Author: hzq
 * @Date: 2019-06-28 15:06:51
 * @Last Modified by: hzq
 * @Last Modified time: 2019-06-28 16:22:03
 * @文件说明: 注册表单
 */
<template>
    <h-form class='register-form' :model="register" :rules="rules" :load="btnLoad" :cancelBtn="false" refkey="loginForm" label-width="0px" confirmBtnText="注册" confirmBtnWidth="100%" @confirm="onLogin">
        <el-form-item prop="UserName">
            <h-input v-model.trim="register.UserName" placeholder="请输入用户名" maxlength="11">
                <template slot="prefix">
                    <img src="~img/mine.png" class="mt9" alt="mine">
                </template>
            </h-input>
        </el-form-item>
        <el-form-item prop="Password">
            <h-input v-model.trim="register.Password" type="password" placeholder="请输入密码" maxlength="18">
                <template slot="prefix">
                    <img src="~img/lock.png" class="mt9" alt="lock">
                </template>
            </h-input>
        </el-form-item>
        <el-form-item prop="Password">
            <h-input v-model.trim="register.Password" type="password" placeholder="请输入密码" maxlength="18">
                <template slot="prefix">
                    <img src="~img/lock.png" class="mt9" alt="lock">
                </template>
            </h-input>
        </el-form-item>
        <el-form-item prop="Captcha">
            <h-input v-model.trim="register.Captcha" type="text" placeholder="请输入验证码" maxlength="4">
                <template slot="prefix">
                    <img src="~img/verification.png" class="mt10" alt="verification">
                </template>
                <template slot="suffix">
                    <img v-if="captchaImg" @click="GetImageCaptcha" class="suffix-img mt5 cursor" :src="captchaImg" alt="suffix-img" />
                    <i v-else class="el-icon-loading" />
                </template>
            </h-input>
        </el-form-item>
    </h-form>
</template>

<script>
    export default {
        name: 'register-form',
        data() {
            return {
                // 图形验证码 base64 地址
                captchaImg: '',
                // 图形验证码Token
                captchaId: '',
                // 注册数据
                register: { UserName: '', Password: '', Captcha: '' },
                // 注册表单验证规则
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
                // 注册按钮loading效果
                btnLoad: false
            }
        },
        created() {
            // 获取验证码图片
            this.GetImageCaptcha()
        },
        methods: {
            // 获取验证码图片
            GetImageCaptcha() {
                this.captchaImg = ''
                this.register.Captcha = ''
                this.$api.GetImageCaptcha().then(res => {
                    if (res.code === 1) {
                        this.captchaImg = res.data.ImageData
                        this.captchaId = res.data.CaptchaId
                    }
                })
            },
            // 注册
            onLogin() {
                if (this.captchaImg) {
                    this.$formRefs.loginForm.validate(valid => {
                        if (valid) {
                            this.btnLoad = true
                            this.$api
                                .Login({
                                    ...this.register,
                                    CaptchaId: this.captchaId
                                })
                                .then(res => {
                                    if (res.code === 1) {
                                        const { Token } = res.data
                                        this.$setToken(Token)
                                    }
                                    this.btnLoad = false
                                }, () => (this.btnLoad = false))
                        } else this.btnLoad = false
                    })
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .register-form {
        & /deep/ .el-form-item {
            // margin-bottom: 25px;
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
