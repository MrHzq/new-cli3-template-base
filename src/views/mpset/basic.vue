/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 15:45:59
 * @文件说明: 基本设置TODO: ok at 2019-07-05 11:26:58
 */
<template>
    <div class='basic'>
        <h-form :model="form" :rules="rules" :load="btnload" :cancelBtn="false" confirmBtnWidth="150" confirmBtnText="保存" label-width="100px" refkey="form" @confirm="onConfirm">
            <el-form-item label="网站标题">
                <h-input v-model.trim="form.WebTitle" placeholder="请输入网站标题" maxlength="100" />
            </el-form-item>
            <el-form-item label="允许注册">
                <h-switch v-model="form.AllowRegister" />
            </el-form-item>
            <el-form-item label="直投价格(分)">
                <h-input v-model.trim="form.NormalPrice" w="130" placeholder="请输入直投价格" maxlength="3" />
            </el-form-item>
            <el-form-item label="关注价格(分)">
                <h-input v-model.trim="form.StarPrice" w="130" placeholder="请输入关注价格" maxlength="3" />
            </el-form-item>
            <el-form-item label="密码输入错误">
                <h-input v-model.trim.number="form.ForbiddenByErrorPasswordNum" w="130" placeholder="请输入次数" maxlength="3" />
                <span class="ml5">次后锁定账号</span>
            </el-form-item>
            <el-form-item label="底部版权">
                <h-input v-model.trim="form.Copyright" placeholder="请输入底部版权" maxlength="500" />
            </el-form-item>
            <h-collapse title="投票速度">
                <div class="flex-s mb20">
                    <el-form-item prop="VoteGapMin" label="每次增加票数" class="mb0">
                        <h-input v-model.trim.number="form.VoteGapMin" w="130" placeholder="请输入最小票数" maxlength="3" />
                    </el-form-item>
                    <span class="ml10 mr10">~</span>
                    <el-form-item prop="VoteGapMax" class="mb0 no-ml">
                        <h-input v-model.trim.number="form.VoteGapMax" w="130" placeholder="请输入最大票数" maxlength="3" />
                    </el-form-item>
                </div>
                <div class="flex-s mb20">
                    <el-form-item prop="IcrPerTimeMin" label="投票间隔秒数" class="mb0">
                        <h-input v-model.trim.number="form.IcrPerTimeMin" w="130" placeholder="请输入最小秒数" maxlength="3" />
                    </el-form-item>
                    <span class="ml10 mr10">~</span>
                    <el-form-item prop="IcrPerTimeMax" class="mb0 no-ml">
                        <h-input v-model.trim.number="form.IcrPerTimeMax" w="130" placeholder="请输入最大秒数" maxlength="3" />
                    </el-form-item>
                </div>
            </h-collapse>
            <h-collapse title="清除设置">
                <div class="flex-b">
                    <el-form-item label="用户日志保存">
                        <h-input v-model.trim.number="form.UserLogSaveDays" w="115" placeholder="请输入天数" maxlength="3" />
                        <span class="ml5">天</span>
                    </el-form-item>
                    <el-form-item label="投票订单保存">
                        <h-input v-model.trim.number="form.VoteOrderSaveDays" w="115" placeholder="请输入天数" maxlength="3" />
                        <span class="ml5">天</span>
                    </el-form-item>
                </div>
                <div class="flex-b">
                    <el-form-item label="充值记录保存">
                        <h-input v-model.trim.number="form.RechargeLogSaveDays" w="115" placeholder="请输入天数" maxlength="3" />
                        <span class="ml5">天</span>
                    </el-form-item>
                    <el-form-item label="消费明细保存">
                        <h-input v-model.trim.number="form.FinancialDetailSaveDays" w="115" placeholder="请输入天数" maxlength="3" />
                        <span class="ml5">天</span>
                    </el-form-item>
                </div>
            </h-collapse>
            <h-collapse title="联系方式">
                <el-form-item label="联系电话">
                    <h-input v-model.trim="form.Phone" placeholder="请输入联系电话" maxlength="11" />
                </el-form-item>
                <el-form-item label="QQ">
                    <h-input v-model.trim="form.QQ" placeholder="多个QQ请用“|”间隔开" maxlength="500" />
                </el-form-item>
                <el-form-item label="微信号">
                    <h-oss type="picture-card" :url="form.Wx" @uploading="btnload=true" @success="wxImgUploadSuccess" @error="btnload=false" />
                </el-form-item>
            </h-collapse>
        </h-form>
    </div>
</template>

<script>
    export default {
        name: 'basic',
        data() {
            return {
                form: {},
                rules: {
                    IcrPerTimeMax: [this.$rules.required('请输入最大秒数')],
                    IcrPerTimeMin: [this.$rules.required('请输入最小秒数')],
                    VoteGapMax: [this.$rules.required('请输入最大票数')],
                    VoteGapMin: [this.$rules.required('请输入最小票数')]
                },
                btnload: false
            }
        },
        created() {
            this.GetVoteMpBasicConf()
        },
        methods: {
            // 获取基本设置数据
            GetVoteMpBasicConf() {
                this.$api.GetVoteMpBasicConf().then(res => {
                    if (res.code === 1) {
                        this.form = res.data
                    }
                })
            },
            // 更新基本设置数据
            UpdateVoteMpBasicConf() {
                this.$api.UpdateVoteMpBasicConf(this.form).then(res => {
                    if (res.code === 1) this.$msg('保存成功', 1)
                    this.btnload = false
                }, () => (this.btnload = false))
            },
            // 微信二维码上传成功事件
            wxImgUploadSuccess(res) {
                this.form.Wx = res.key
                this.btnload = false
            },
            // 确认按钮事件
            onConfirm() {
                this.$formRefs.form.validate(valid => {
                    if (valid) {
                        this.btnload = true
                        this.UpdateVoteMpBasicConf()
                    }
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .basic {
        width: 500px;
        color: $c6;
        & /deep/ .h-form {
            .no-ml {
                .el-form-item__content {
                    margin-left: 0 !important;
                }
            }
        }
    }
</style>
