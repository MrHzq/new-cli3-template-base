/*
 * @Author: hzq
 * @Date: 2019-07-08 11:44:56
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 10:53:46
 * @文件说明: 投票管理-编辑form 组件
 */
<template>
    <div v-if="voteObj" class='vote-edit'>
        <h-form :model="voteObj" :rules="rules" :load="fload" refkey="voteObjForm" label-width="130px" :cancelBtn="false" confirmBtnWidth="150" :confirmBtnText="$attrs.confirmBtnText||'确定修改'" @confirm="onConfirm">
            <el-form-item label="用户名">
                {{voteObj.VoteMpUser.UserName}}
            </el-form-item>
            <template v-if="!isAdd">
                <el-form-item label="下单时间">
                    {{voteObj.CreatedAt}}
                </el-form-item>
                <el-form-item label="订单编号">
                    {{voteObj.Number}}
                </el-form-item>
                <el-form-item label="订单状态">
                    <span :class="statusOption[voteObj.Status-1].colorClass">{{statusOption[voteObj.Status-1].label}}</span>
                </el-form-item>
            </template>
            <el-form-item label="活动名称">
                {{voteObj.Activity.Name}}
            </el-form-item>
            <el-form-item label="活动网址">
                {{voteObj.ViewUrl}}
            </el-form-item>
            <el-form-item label="单价(分)">
                {{voteObj.Price}}
            </el-form-item>
            <el-form-item prop="VoteTask.VoteNumNeed" label="需求票数">
                <h-input v-if="isAdd" v-model.trim.number="voteObj.VoteTask.VoteNumNeed" w="150" placeholder="请输入需求票数" />
                <span v-else>{{voteObj.VoteTask.VoteNumNeed}}</span>
            </el-form-item>
            <template v-if="!isAdd">
                <el-form-item label="完成票数">
                    {{voteObj.VoteTask.VoteNumNow}}
                </el-form-item>
                <el-form-item label="订单金额(元)">
                    <span class="primary">{{$fprice(voteObj.Money)}}</span>
                </el-form-item>
            </template>
            <template v-if="!isRefund">
                <div class="flex-s mb20">
                    <el-form-item prop="VoteTask.VoteGapMin" label="每次增加票数" class="mb0">
                        <h-input v-model.trim.number="voteObj.VoteTask.VoteGapMin" w="150" placeholder="请输入最小票数" />
                    </el-form-item>
                    <span class="ml10 mr10">~</span>
                    <el-form-item prop="VoteTask.VoteGapMax" class="mb0 no-ml">
                        <h-input v-model.trim.number="voteObj.VoteTask.VoteGapMax" w="150" placeholder="请输入最大票数" />
                    </el-form-item>
                </div>
                <div class="flex-s mb20">
                    <el-form-item prop="VoteTask.IcrPerTimeMin" label="投票间隔时间(秒)" class="mb0">
                        <h-input v-model.trim.number="voteObj.VoteTask.IcrPerTimeMin" w="150" placeholder="请输入最小秒数" />
                    </el-form-item>
                    <span class="ml10 mr10">~</span>
                    <el-form-item prop="VoteTask.IcrPerTimeMax" class="mb0 no-ml">
                        <h-input v-model.trim.number="voteObj.VoteTask.IcrPerTimeMax" w="150" placeholder="请输入最大秒数" />
                    </el-form-item>
                </div>
            </template>
            <template v-if="!isAdd">
                <el-form-item label="订单备注">
                    {{voteObj.Remark || '无'}}
                </el-form-item>
            </template>
            <el-form-item label="投票对象" :class="{mb60:!(isRefund||isAdd)}">
                <vote-item-table :isAdd="isAdd" @selection-change="ids=>selectVoteItemIds=ids" />
            </el-form-item>
            <template v-if="isRefund">
                <el-form-item label="退款金额">
                    <span class="danger">{{$fprice(voteObj.RefundMoney)}}</span>
                </el-form-item>
            </template>
            <template v-if="isAdd">
                <el-form-item label="订单金额">
                    <span class="danger">{{$fprice(voteObj.Price*voteObj.VoteTask.VoteNumNeed*0.01)}}</span>
                </el-form-item>
            </template>
        </h-form>
    </div>
</template>

<script>
    export default {
        name: 'vote-edit',
        props: {
            // 是否为退款状态：是 隐藏每次增加票数 和投票间隔时间(秒)
            isRefund: {
                type: Boolean,
                default: false
            },
            // 是否为补票状态：是
            isAdd: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 活动网址
                ViewUrl: '',
                // 投票表单数据
                voteObj: null,
                // 表单验证规则
                rules: {
                    'VoteTask.IcrPerTimeMax': [
                        {
                            required: true,
                            message: '请输入最大秒数',
                            trigger: 'blur'
                        }
                    ],
                    'VoteTask.IcrPerTimeMin': [
                        {
                            required: true,
                            message: '请输入最小秒数',
                            trigger: 'blur'
                        }
                    ],
                    'VoteTask.VoteGapMax': [
                        {
                            required: true,
                            message: '请输入最大票数',
                            trigger: 'blur'
                        }
                    ],
                    'VoteTask.VoteGapMin': [
                        {
                            required: true,
                            message: '请输入最小票数',
                            trigger: 'blur'
                        }
                    ],
                    'VoteTask.VoteNumNeed': [
                        {
                            required: true,
                            message: '请输入需求票数',
                            trigger: 'blur'
                        }
                    ]
                },
                // 表单按钮loading效果
                fload: false,
                //订单状态数据
                statusOption: [
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
                // 下单时选择的选手id数组
                selectVoteItemIds: []
            }
        },
        created() {
            this.GetVoteOrder()
        },
        methods: {
            // 获取活动网址
            GetVoteOrder() {
                this.$api.GetVoteOrder({ Id: this.$id(this) }).then(res => {
                    if (res.code === 1) {
                        this.voteObj = res.data
                    }
                })
            },
            // 确认修改事件
            onConfirm() {
                this.$formRefs.voteObjForm.validate(valid => {
                    if (valid) {
                        this.fload = true
                        if (this.isRefund) {
                            // 退款接口
                            this.$api
                                .RefundVoteOrder({ VoteOrderId: this.voteObj.Id })
                                .then(res => {
                                    if (res.code === 1) {
                                        this.$msg('退款成功', 1)
                                        this.$go()
                                    }
                                    this.fload = false
                                }, () => (this.fload = false))
                        } else if (this.isAdd) {
                            if (this.selectVoteItemIds.length) {
                                // 补票下单接口
                                this.$api
                                    .PlaceVoteOrder({
                                        Id: this.voteObj.Id,
                                        ActivityId: this.voteObj.ActivityId,
                                        VoteMpUserId: this.voteObj.VoteMpUser.Id,
                                        VoteItemIds: this.selectVoteItemIds,
                                        VoteNumNeed: this.voteObj.VoteTask
                                            .VoteNumNeed,
                                        IcrPerTimeMax: this.voteObj.VoteTask
                                            .IcrPerTimeMax,
                                        IcrPerTimeMin: this.voteObj.VoteTask
                                            .IcrPerTimeMin,
                                        VoteGapMax: this.voteObj.VoteTask
                                            .VoteGapMax,
                                        VoteGapMin: this.voteObj.VoteTask.VoteGapMin
                                    })
                                    .then(res => {
                                        if (res.code === 1) {
                                            this.$msg('下单成功', 1)
                                            this.$go()
                                        }
                                        this.fload = false
                                    }, () => (this.fload = false))
                            } else {
                                this.$msg('请选择投票对象')
                                this.fload = false
                            }
                        } else {
                            // 修改 接口
                            this.$api
                                .UpdateVoteOrder({
                                    Id: this.voteObj.Id,
                                    IcrPerTimeMax: this.voteObj.VoteTask
                                        .IcrPerTimeMax,
                                    IcrPerTimeMin: this.voteObj.VoteTask
                                        .IcrPerTimeMin,
                                    VoteGapMax: this.voteObj.VoteTask.VoteGapMax,
                                    VoteGapMin: this.voteObj.VoteTask.VoteGapMin
                                })
                                .then(res => {
                                    if (res.code === 1) {
                                        this.$msg('修改成功', 1)
                                        this.$go()
                                    }
                                    this.fload = false
                                }, () => (this.fload = false))
                        }
                    }
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .vote-edit {
        color: #606266;
        & /deep/ .h-form {
            .no-ml {
                .el-form-item__content {
                    margin-left: 0 !important;
                }
            }
            .el-form-item {
                margin-bottom: 10px;
            }
            .mb60 {
                margin-bottom: 60px;
            }
        }
    }
</style>
