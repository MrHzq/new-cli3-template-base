import Cookies from 'js-cookie'

export default {
    install(Vue) {
        const TokenKey = 'VoteMpAdmin-Token'
        const authUser = () => Vue.prototype.$getItem('authUser')

        const getToken = () => {
            return Cookies.get(authUser() ? 'Auth-Token' : TokenKey)
        }

        const setToken = token => {
            return Cookies.set(authUser() ? 'Auth-Token' : TokenKey, token)
        }

        const removeToken = () => {
            return Cookies.remove(authUser() ? 'Auth-Token' : TokenKey)
        }

        Vue.$getToken = getToken
        Vue.$setToken = setToken
        Vue.$removeToken = removeToken
        Vue.prototype.$getToken = getToken
        Vue.prototype.$setToken = setToken
        Vue.prototype.$removeToken = removeToken
    }
}
