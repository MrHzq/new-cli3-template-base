/*
 * @Author: hzq
 * @Date: 2019-07-09 11:07:45
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 11:45:48
 * @文件说明: 表单验证规则
 */
const rules = {
    // ==================带有正则的==================
    // 手机号
    Phone(message = '请输入正确的手机号', trigger = 'blur', required = false) {
        return {
            required,
            message,
            trigger,
            pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
        }
    },

    // QQ号
    QQ(
        message = '请输入正确的QQ号（纯数字，5-11位）',
        trigger = 'blur',
        required = false
    ) {
        return {
            required,
            message,
            trigger,
            pattern: /^[1-9][0-9]{4,10}$/
        }
    },

    // 链接地址
    Link(message = '请输入正确的链接地址', trigger = 'blur', required = false) {
        return {
            required,
            message,
            trigger,
            pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
        }
    },

    // 数字
    Number(message = '请输入正确的数字', trigger = 'blur', required = false) {
        return {
            required,
            message,
            trigger,
            pattern: /^[0-9]+$/
        }
    },
    // 英文和数字
    EnAndNum(message = '请输入英文和数字', trigger = 'blur', required = false) {
        return {
            required,
            message,
            trigger,
            pattern: /^[A-Za-z0-9]+$/
        }
    },

    // ==================带有正则的==================

    // 输入长度区间 [6,18]
    Len(
        min = 6,
        max = 18,
        message = '长度为 6 到 18 位',
        trigger = 'blur',
        required = false
    ) {
        return {
            required,
            min,
            max,
            message,
            trigger
        }
    },

    // 必填
    required(message = '请输入内容', trigger = 'change', required = true) {
        return {
            required,
            message,
            trigger
        }
    }
}
export default {
    install(Vue) {
        Vue.prototype.$rules = rules
    }
}
