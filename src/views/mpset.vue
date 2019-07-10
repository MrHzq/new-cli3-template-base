/*
 * @Author: hzq
 * @Date: 2019-07-01 14:57:38
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-09 10:24:03
 * @文件说明: 平台设置 TODO: ok at 2019-07-05 11:20:08
 */
<template>
    <div class='mpset'>
        <h-tabs :tabValue="$route.name" :tabPane="tabPane" type="card" router class="mb20" />
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'mpset',
        data() {
            return {
                tabPane: [
                    {
                        name: 'basic',
                        label: '基本设置'
                    },
                    {
                        name: 'recharges',
                        label: '充值设置'
                    },
                    {
                        name: 'news',
                        label: '公告设置'
                    },
                    {
                        name: 'admin',
                        label: '管理员设置'
                    }
                ]
            }
        },
        created() {
            if (this.$route.path === '/mpset') this.$tor('/mpset/basic')
        }
    }
</script>

<style lang='scss' scoped></style>
