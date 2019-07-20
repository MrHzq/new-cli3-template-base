/*
 * @Author: hzq
 * @Date: 2019-07-08 16:18:25
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-20 10:45:26
 * @文件说明: Vue 全局方法 封装
 */

export default {
    install(Vue, router) {
        // 页面后退
        Vue.prototype.$go = () => router.go(-1)
        // 页面跳转 push
        Vue.prototype.$to = (path, query = {}) => router.push({ path, query })
        // 页面跳转 replace
        Vue.prototype.$tor = (path, query = {}) => {
            router.replace({ path, query })
        }

        // 将值转为%或px
        Vue.prototype.$px = val => (String(val).match('%') ? val : val + 'px')

        // sessionStorage 移除一项
        Vue.prototype.$removeItem = key => {
            sessionStorage.removeItem('bjz_' + key)
        }
        // sessionStorage 移除所有项
        Vue.prototype.$clearItem = () => sessionStorage.clear()

        // 获取地址query id的数据
        Vue.prototype.$id = that => Number(that.$route.query.id) || 0

        // 获取地址query 对应key的数据，可以Number、String形式返回的，默认获取 id，返回0
        Vue.prototype.$gquery = (that, key = 'id', _default = 0) => {
            let _r = that.$route.query[key]
            if (typeof _default === 'number') _r = Number(_r)
            return _r || _default
        }

        // 获取地址栏上的参数对象
        Vue.prototype.$parseQuery = (str = location.search.substr(1)) => {
            return Vue.$tool.parseQuery(str)
        }

        // 日期格式化 YYYY-MM-DD hh:mm:ss
        Vue.prototype.$fdate = (date, flag = 'YYYY-MM-DD HH:mm:ss') => {
            return Vue.$tool.formatDate(new Date(date), flag)
        }

        /**
         * param 将要转为URL参数字符串的对象
         * key URL参数字符串的前缀
         * encode true/false 是否进行URL编码,默认为true
         * 对象转为URL参数
         * return URL参数字符串 &name=12&age=32
         */

        const objurl = (param, key, encode) => {
            if (param == null) return ''
            let paramStr = ''
            const t = typeof param
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr +=
                    '&' +
                    key +
                    '=' +
                    (encode == null || encode
                        ? encodeURIComponent(param)
                        : param)
            } else {
                for (let i in param) {
                    const k =
                        key == null
                            ? i
                            : key +
                              (param instanceof Array ? '[' + i + ']' : '.' + i)
                    paramStr += objurl(param[i], k, encode)
                }
            }
            return paramStr
        }
        Vue.prototype.$objurl = objurl

        // for in 深拷贝对象
        const deepCopy = obj => {
            var result = Array.isArray(obj) ? [] : {}
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        result[key] = deepCopy(obj[key]) //递归复制
                    } else {
                        result[key] = obj[key]
                    }
                }
            }
            return result
        }
        Vue.prototype.$deepCopy = deepCopy

        // 按照指定页数跳转页面
        Vue.prototype.$pageTo = (that, page = 1, query = null) => {
            const _query = that.$deepCopy(query || that.$route.query)
            _query.page = page
            that.$to(that.$route.path, _query)
        }

        // 按照指定参数跳转页面：query对象的this、key、值、要跳转的页面（默认为当前页面）
        Vue.prototype.$queryTo = (that, key, val, path = '') => {
            const _query = that.$deepCopy(that.$route.query)
            _query[key] = val
            _query.page = 1
            that.$to(path || that.$route.path, _query)
        }

        // 前端登出
        Vue.prototype.$fedLogOut = () => {
            Vue.$removeToken()
            Vue.prototype.$tor('/login')
        }

        // 金额格式化方法：加￥和2位小数点
        Vue.prototype.$fprice = (val, type = '') => {
            val = Number(val)
            if (isNaN(val)) val = 0
            val = val.toFixed(2)
            if (type === 'p') val = '￥' + val
            else if (type === 's') val += '元'
            return val
        }

        // 表格：根据传入的prop，将值渲染出来，可渲染金额格式的
        Vue.prototype.$tableVal = (that, row) => {
            const prop = that.prop || that.$attrs.prop
            const keyArr = prop.split('.')
            const len = keyArr.length
            const lastKey = keyArr.pop()
            let _row = that.$copy(row)
            if (len) {
                for (let i = 0; i < len - 1; i++) _row = _row[keyArr[i]]
            }
            if (!_row.hasOwnProperty(lastKey)) {
                throw new Error(`【${prop}】 Error Key: ${lastKey}`)
            }
            let value = _row[lastKey]
            if (that.price) value = that.$fprice(value)
            return value
        }

        // 获取当前的颜色或颜色class，返回值：{ class: '', style: {}}
        Vue.prototype.$color = color => {
            const backObj = { class: '', style: {} }
            if (color) {
                if (color.match('#')) backObj.style.color = color
                else backObj.class = color
            }
            return backObj
        }

        // 重置对象，将值处理为空
        Vue.prototype.$reset = (_data, type = 'obj') => {
            let data = Vue.prototype.$copy(_data)
            if (type === 'obj') {
                for (const k in data) {
                    if (typeof data[k] === 'object') {
                        if (Array.isArray(data[k])) {
                            console.log(data[k])
                        } else data[k] = Vue.prototype.$reset(data[k])
                    } else data[k] = ''
                }
            } else if (type === 'json') {
                data = data.map(d => Vue.prototype.$reset(d))
            }
            _data = data
            return data
        }

        // 页面相关的，处理参数的，并访问对应的方法
        Vue.prototype.$handelFun = (that, api) => {
            if (that.$gquery(that, 'page', 1) === 1) {
                // 当 页码为 1 时，直接调用方法，更新数据
                that[api]()
            } else that.$pageTo(that) // 否则 跳转到 第一页
        }

        // // 生成二维码方法
        // Vue.prototype.$qrcode = (host = 'www.baidu.com', obj = {}) => {
        //     return QRCode.toDataURL(host, {
        //         width: 250,
        //         height: 250,
        //         margin: 1,
        //         ...obj
        //     })
        // }

        // 验证值是否为空
        Vue.prototype.$checkValEmpty = str => {
            if (str) {
                if (typeof str === 'object') {
                    return Array.isArray(str)
                        ? str.length <= 0
                        : Object.keys(str).length <= 0
                } else return false
            } else return true
        }
    }
}
