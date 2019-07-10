/*
 * @Author: hzq
 * @Date: 2019-07-01 12:02:06
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-04 18:25:18
 * @文件说明: 页头
 */
<template>
    <div v-if="pageHead" class='h-page-head'>
        <div class="title f18">{{pageHead.title}}</div>
        <p v-show="pageHead.tip" class="tip c6 mt5">{{pageHead.tip}}</p>
    </div>
</template>

<script>
    export default {
        name: 'h-page-head',
        computed: {
            pageHead() {
                const key = this.$route.path.split('/')[1]
                return this.$pageHead[key]
            }
        }
    }
</script>

<style lang='scss' scoped>
    .h-page-head {
        padding: 15px 20px;
        background-color: #f8f8f8;
    }
</style>
