import Vue from 'vue'
import Router from 'vue-router'
import hzqRouter from 'hzq-router'

Vue.use(Router)

const routes = hzqRouter({
    redirect: '/login',
    rc: require.context('@/views', true, /\.vue$/)
})
routes.map(val => {
    if (val.children && val.name) delete val.name
})

routes.find(r => r.path === '/index').path = '/'

console.log(routes)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
