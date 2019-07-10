import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Tool from './tool/index'
import Auth from './tool/auth'
import hzqTool from 'hzq-tool'
import hzqAxios from 'hzq-axios'
import './components/global'
import Element from 'element-ui'

Vue.use(Element)

// Element 删除弹窗提示方法
Vue.prototype.$del = (params = {}) => {
    params = Object.assign(
        {
            title: '提示',
            text: '是否确认删除？',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        },
        params
    )
    return Vue.prototype.$confirm(params.text, params.title, {
        confirmButtonText: params.confirmButtonText,
        cancelButtonText: params.cancelButtonText,
        type: 'warning'
    })
}

// Element 消息提示方法
const Msg = (
    message = '',
    index = 3,
    offset = 250,
    customClass = 'el-hzq-msg'
) => {
    const type = ['info', 'success', 'warning', 'error']
    if (message) {
        Vue.prototype.$message({
            offset,
            message,
            customClass,
            showClose: true,
            type: type[index]
        })
    }
}
Vue.prototype.$msg = Msg

Vue.use(hzqTool, 'bjz_')
Vue.use(Auth)
Vue.use(Tool, router)

// hzqAxios 使用
Vue.use(hzqAxios, require.context('@/apiurl', true, /\.js$/), {
    baseURL: '/api',
    createConfig: { timeout: 15000 },
    beforeRequest(config) {
        if (
            ['/Activity/DownVoteItemInfo', '/VoteItem/DownVoteLog'].includes(
                config.url
            )
        ) {
            config.responseType = 'blob'
        }
        const token = Vue.$getToken()
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    // 接口响应成功事件
    respSuccess(res) {
        const newToken = res.headers['jwt-token'] || res.headers['Jwt-Token']
        if (newToken) Vue.$setToken(newToken)
        const { data } = res
        if (data) {
            if (res.request.responseType === 'blob') return
            if (typeof data === 'object') {
                for (const k in data) data[k.toLowerCase()] = data[k]
                if (data.code !== 1) Msg(data.msg)
            }
        }
    },
    // 接口响应失败事件
    respError(e) {
        if (e.response && e.response.data) {
            if (typeof e.response.data === 'object') {
                Msg(e.response.data.Msg)
                if (e.response.data.Code === 401) {
                    Vue.prototype.$fedLogOut()
                }
            } else Msg('网络错误，请稍后重试')
        } else Msg('网络错误，请稍后重试')
    }
})

// 获取用户信息
Vue.prototype.$userinfo = () => Vue.prototype.$copy(store.state.userInfo)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

router.beforeEach(({ name }, from, next) => {
    const whiteList = Vue.prototype.$alonePageArr
    if (Vue.$getToken()) next()
    else {
        if (whiteList.includes(name)) next()
        else next('/login') // 否则全部重定向到登录页
    }
})
