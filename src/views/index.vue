/*
 * @Author: hzq
 * @Date: 2019-06-28 10:47:55
 * @Last Modified by: hzq
 * @Last Modified time: 2019-07-10 09:47:55
 * @文件说明: 登录、注册页面
 */
<template>
    <div class='index flex-c'>
        <div class="index-content flex-a bgf">
            <img src="~img/login_left_img.png" alt="login_left_img">
            <div class="form-warp">
                <div class="align-c f24 mb40">登录</div>
                <!-- <h-tabs :tabPane="tabPane" noline @click="to=>$to('/'+to)" /> -->
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                tabPane: [
                    {
                        name: 'login',
                        label: '登录'
                    },
                    {
                        name: 'register',
                        label: '注册'
                    }
                ]
            }
        }
    }
</script>

<style lang='scss' scoped>
    .index {
        height: 100vh;
        min-width: 900px;
        // background-color: $primary;
        @include bgi('~img/login_bg.png');
        &-content {
            width: 1100px;
            height: 620px;
            border-radius: 18px;
            .form-warp {
                width: 340px;
            }
        }
    }
</style>
