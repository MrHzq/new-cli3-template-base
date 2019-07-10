/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 11:40:54
 * @文件说明: 充值设置
 */
<template>
    <div class='recharges'>
        <h-form :model="form" :load="btnload" :cancelBtn="false" confirmBtnWidth="150" confirmBtnText="保存" @confirm="onConfirm">
            <h-collapse title="支付设置">
                <el-form-item label="支付宝">
                    <h-switch v-model="form.OpenAlipay" />
                </el-form-item>
                <el-form-item label="微信">
                    <h-switch v-model="form.OpenWxPay" />
                </el-form-item>
            </h-collapse>
            <h-collapse title="充值优惠">
                <el-form-item label="充值优惠">
                    <h-switch v-model="form.OpenDiscount" />
                </el-form-item>
                <el-form-item label="充值满">
                    <h-input v-model.trim="form.Money" w="130" placeholder="请输入金额" />
                    <span class="ml5 c3">元</span>
                </el-form-item>
                <el-form-item label="赠送">
                    <h-input v-model.trim="form.GivePercent" w="130" placeholder="请输入金额" maxlength="3" />
                    <span class="ml5 c3">%</span>
                </el-form-item>
                <el-form-item label="截止时间">
                    <h-date-picker v-model="form.GiveEndTime" placeholder="请选择截止时间" />
                </el-form-item>
                <el-form-item label="充值描述">
                    <h-input type="textarea" v-model.trim="form.GiveRemark" :rows="5" placeholder="请输入充值描述" maxlength="500" />
                </el-form-item>
            </h-collapse>
        </h-form>
    </div>
</template>

<script>
    export default {
        name: 'recharges',
        data() {
            return { form: {}, btnload: false }
        },
        created() {
            this.GetVoteMpRechargeConf()
        },
        methods: {
            // 获取充值设置数据
            GetVoteMpRechargeConf() {
                this.$api.GetVoteMpRechargeConf().then(res => {
                    if (res.code === 1) {
                        this.form = res.data
                    }
                })
            },
            // 更新充值设置数据
            UpdateVoteMpRechargeConf() {
                this.$api.UpdateVoteMpRechargeConf(this.form).then(res => {
                    if (res.code === 1) {
                        this.$msg('保存成功', 1)
                    }
                    this.btnload = false
                }, () => (this.btnload = false))
            },
            // 确认按钮事件
            onConfirm() {
                this.btnload = true
                this.UpdateVoteMpRechargeConf()
            }
        }
    }
</script>

<style lang='scss' scoped>
    .recharges {
        width: 500px;
        color: $c6;
    }
</style>
