/*
 * @Author: hzq
 * @Date: 2019-07-08 16:18:42
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 18:30:07
 * @文件说明: Vue 全局变量 封装
 */
import color from '@/style/color.scss'

export default {
    install(Vue) {
        // 表单refs
        Vue.prototype.$formRefs = {}
        Vue.prototype.$color = color

        // 为单独页面的 path 变量
        Vue.prototype.$alonePageArr = [
            'login',
            'register',
            'busy',
            'nofind',
            'wxbind'
        ]

        // 每个页面的页头
        Vue.prototype.$pageHead = {
            mpset: {
                title: '平台设置'
                // tip: '这里放标题对应描述'
            },
            user: {
                title: '用户管理'
                // tip: '这里放标题对应描述'
            },
            finance: {
                title: '财务明细'
                // tip: '这里放标题对应描述'
            },
            recharge: {
                title: '充值记录'
                // tip: '这里放标题对应描述'
            },
            userlog: {
                title: '用户日志'
                // tip: '这里放标题对应描述'
            },
            act: {
                title: '活动管理'
                // tip: '这里放标题对应描述'
            },
            vote: {
                title: '投票管理'
                // tip: '这里放标题对应描述'
            },
            'vote-edit': {
                title: '查看投票任务'
                // tip: '这里放标题对应描述'
            },
            'vote-refund': {
                title: '退款'
                // tip: '这里放标题对应描述'
            },
            'vote-add': {
                title: '补票'
                // tip: '这里放标题对应描述'
            }
        }

        // 每页数量
        Vue.prototype.$pageSize = 8

        // 分页是否开启路由模式
        Vue.prototype.$pageRouter = true

        // 是否为测试环境
        Vue.prototype.$istest = process.env.NODE_ENV !== 'production'

        // oss域名
        Vue.prototype.$osshost = Vue.prototype.$istest
            ? 'https://wxvote.oss-cn-hangzhou.aliyuncs.com/'
            : 'https://lpoll.oss-cn-hangzhou.aliyuncs.com/'
    }
}
