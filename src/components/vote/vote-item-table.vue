/*
 * @Author: hzq
 * @Date: 2019-07-08 16:43:57
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 15:50:59
 * @文件说明: 投票管理-投票对象表格 组件
 */
<template>
    <div class='vote-item-table'>
        <h-table v-loading="tload" :data="voteItemList" max-height="548" @selection-change="handleSelectionChange">
            <el-table-column v-if="isAdd" type="selection" width="55">
            </el-table-column>
            <el-table-column label="投票选手" min-width="120">
                <div slot-scope="scope" class="flex-s">
                    <h-bgi :src="$osshost+scope.row.VoteItem.Cover" />
                    <span class="mr5 ml5">{{scope.row.VoteItem.Number}}号</span>
                    <span class="flex ellipsis1">{{scope.row.VoteItem.Name}}</span>
                </div>
            </el-table-column>
            <el-table-column prop="StartVoteNum" label="开始票数" align="center" />
            <template v-if="!isAdd">
                <el-table-column prop="VoteItem.VoteNum" label="当前票数" align="center" />
                <el-table-column label="增加票数" align="center">
                    <template slot-scope="scope">
                        {{scope.row.VoteItem.VoteNum - scope.row.StartVoteNum }}
                    </template>
                </el-table-column>
            </template>
        </h-table>
        <h-button v-if="!isAdd" class="refresh-btn" type="primary" @click="GetVoteTaskItemList">刷新票数</h-button>
    </div>
</template>

<script>
    export default {
        name: 'vote-item-table',
        props: {
            // 是否为补票状态：是
            isAdd: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 列表数据
                voteItemList: [],
                // 列表加载
                tload: true
            }
        },
        created() {
            this.GetVoteTaskItemList()
        },
        methods: {
            // 获取投票对象数据
            GetVoteTaskItemList() {
                this.tload = true
                this.$api
                    .GetVoteTaskItemList({
                        VoteTaskId: this.$gquery(this, 'taskid')
                    })
                    .then(res => {
                        if (res.code === 1) {
                            this.tload = false
                            this.voteItemList = res.data.List
                        }
                    })
            },
            // 当为 下单时，表格复选框 选中事件
            handleSelectionChange(val) {
                const ids = []
                val.map(v => ids.push(v.VoteItem.Id))
                this.$emit('selection-change', ids)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .vote-item-table {
        position: relative;
        .h-table {
            width: 65% !important;
            min-height: 134px;
            margin-top: -13px;
            margin-left: -10px;
        }
        .refresh-btn {
            position: absolute;
            top: 50%;
            left: 65%;
            transform: translateY(-50%);
            margin-left: 40px;
        }
    }
</style>
