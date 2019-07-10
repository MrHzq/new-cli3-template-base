<template>
    <div id="app" class="c3 f14">
        <h-header />
        <router-view v-if="router" />
        <div class="home" v-else>
            <div class="scrollbar">
                <div class="scrollbar__wrap">
                    <div class="scrollbar__view mWidth">
                        <h-aside />
                        <div class="router-warp">
                            <h-page-head />
                            <router-view class="router-view" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    computed: {
        router() {
            return this.$alonePageArr.includes(this.$route.name)
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    .home {
        .scrollbar {
            height: calc(100vh - 80px);
            margin-top: 80px;
            overflow: hidden;
            .scrollbar__wrap {
                height: 100%;
                overflow: auto;
                /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
                &::-webkit-scrollbar {
                    width: 0;
                    background-color: #fff;
                }
                .scrollbar__view {
                    .router-warp {
                        padding-left: $asideWidth;
                        .router-view {
                            padding: 30px 20px;
                        }
                    }
                }
            }
        }
    }
}
</style>
