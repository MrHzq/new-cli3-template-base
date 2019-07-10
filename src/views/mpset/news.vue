/*
 * @Author: hzq
 * @Date: 2019-07-01 14:59:44
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 14:28:09
 * @文件说明: 公告设置
 */
<template>
    <div class='news'>
        <tabs-with-filter :tabValue.sync="listParams.ShowType" :searchKey.sync="listParams.SearchKey" :tab="{tabPane:tabPane,novalueToName:true}" :search="{w:200,placeholder:'请输入ID/标题'}" @on-return="handelListParams">
            <h-button w="110" add @click="isadd=true,newsDialog=true">新增公告</h-button>
        </tabs-with-filter>
        <h-table v-loading="tload" :data="tableList">
            <h-table-id />
            <h-table-title min-width="350" max-width="800px" overcol="2" opentip @text-click="i=>onCommand({op:'edit',i})" />
            <h-table-switch @change="scope=>tableChange('Top',scope.row)" />
            <h-table-select :option="showOption" prop="IsShow" @change="scope=>tableChange('Show',scope.row)" />
            <el-table-column prop="ViewNum" label="浏览量" align="center" />
            <h-table-time />
            <h-table-op @command="onCommand" />
        </h-table>
        <h-page :pageIndex.sync="listParams.PageIndex" :total="count" />
        <h-dialog :visible.sync="newsDialog" :title="(isadd?'新增':'编辑')+'公告'" width="660px" @closed="onClosed">
            <h-form :model="newsForm" :rules="rules" :load="fload" refkey="newsForm" stop @cancel="newsDialog=false" @confirm="onConfirm">
                <el-form-item prop="Title" label="标题">
                    <h-input v-model.trim="newsForm.Title" type="textarea" placeholder="请输入标题" maxlength="100" autosize/>
                </el-form-item>
                <el-form-item prop="Content" label="内容">
                    <h-editor :content.sync="newsForm.Content" :key="newsForm.Id" placeholder="请输入内容" height="450" />
                </el-form-item>
            </h-form>
        </h-dialog>
    </div>
</template>

<script>
    export default {
        name: 'news',
        data() {
            return {
                // 所有tab选项
                tabPane: [
                    {
                        name: 1,
                        label: '显示'
                    },
                    {
                        name: 2,
                        label: '隐藏'
                    }
                ],
                // 表格列表数据
                tableList: [],
                // 表格是否加载
                tload: false,
                // 获取表格所需的参数
                listParams: {
                    ShowType: 0,
                    SearchKey: '',
                    PageIndex: 1,
                    PageSize: this.$pageSize
                },
                // 列表总页数
                count: 0,
                // 表格-状态所有选项
                showOption: [
                    {
                        value: true,
                        label: '显示'
                    },
                    {
                        value: false,
                        label: '隐藏'
                    }
                ],
                // 是否显示news弹窗
                newsDialog: false,
                // 是否为新增
                isadd: true,
                // news 表单数据
                newsForm: {
                    Id: Number(new Date()),
                    Title: '',
                    Content: ''
                },
                // 空的 news 表单数据
                emptyNewsForm: {
                    Title: '',
                    Content: ''
                },
                // 表单验证规则
                rules: {
                    Title: [this.$rules.required('请输入标题')],
                    Content: [this.$rules.required()]
                },
                // 表单按钮是否加载
                fload: false
            }
        },
        watch: {
            $route: {
                handler() {
                    if (this.$pageRouter) {
                        // 获取地址上的 ShowType
                        this.listParams.ShowType = this.$gquery(this, 'tab')
                        // 获取地址上的 PageIndex
                        this.listParams.PageIndex = this.$gquery(this, 'page', 1)
                        // 获取公告列表
                        this.GetVoteMpNewsList()
                    }
                },
                immediate: true
            }
        },
        methods: {
            // 获取公告列表
            GetVoteMpNewsList() {
                this.tload = true
                this.$api.GetVoteMpNewsList(this.listParams).then(res => {
                    if (res.code === 1) {
                        this.count = res.data.Count
                        this.tableList = res.data.List
                        this.$nextTick(() => (this.tload = false))
                    }
                })
            },
            // 表单确认事件：新增||编辑公告
            onConfirm() {
                this.$formRefs.newsForm.validate(valid => {
                    if (valid) {
                        this.fload = true
                        let key = this.isadd ? 'AddVoteMpNews' : 'UpdateVoteMpNews'
                        this.$api[key](this.newsForm).then(res => {
                            if (res.code === 1) {
                                this.newsDialog = false
                                this.$msg(this.isadd ? '新增成功' : '编辑成功', 1)
                                if (this.isadd) {
                                    // 清空查询条件
                                    this.listParams.SearchKey = ''
                                    if (
                                        this.listParams.PageIndex === 1 &&
                                        this.listParams.ShowType === 0
                                    ) {
                                        // 当 处于 【全部、第一页】时，就重新调接口更新数据
                                        this.GetVoteMpNewsList()
                                    } else {
                                        // 否则 就跳转到【全部、第一页】
                                        this.$queryTo(this,'tab', 0)
                                    }
                                } else this.GetVoteMpNewsList()
                            }
                            this.fload = false
                        }, () => (this.fload = false))
                    }
                })
            },
            // 弹窗关闭，重置表单数据
            onClosed() {
                this.$formRefs.newsForm.resetFields()
                this.newsForm = this.$copy(this.emptyNewsForm)
                this.newsForm.Id = Number(new Date())
            },
            // 更改表单显示、隐藏状态
            tableChange(type, row) {
                // type：Show、Top
                this.$api['UpdateVoteMpNews' + type](row).then(res => {
                    if (res.code === 1) {
                        this.$msg('修改成功', 1)
                        if (type === 'Show' && this.listParams.ShowType) {
                            this.handelListParams()
                        }
                    }
                })
            },
            // 表单操作事件
            onCommand({ op, i }) {
                if (op === 'del') {
                    this.$del().then(
                        () => {
                            this.$api.DelVoteMpNews({ Id: i.Id }).then(res => {
                                if (res.code === 1) {
                                    this.$msg('删除成功', 1)
                                    this.handelListParams()
                                }
                            })
                        },
                        () => {}
                    )
                } else {
                    // 编辑公告
                    this.isadd = false
                    this.newsForm = this.$copy(i)
                    this.newsDialog = true
                }
            },
            // 处理列表接口参数
            handelListParams() {
                this.$handelFun(this, 'GetVoteMpNewsList')
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>
