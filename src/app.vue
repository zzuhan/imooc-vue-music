<template>
    <div id="app">
        <m-header/>
        <tab/>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>

<script type="text/ecmascript-6">
    import MHeader from 'components/m-header/m-header';
    import Tab from 'components/tab/tab';

    export default {
        components:{
            MHeader,
            Tab
        }
    }
</script>

// lang 属性设置或返回元素的语言
<style scoped lang="stylus" rel="stylesheet/stylus"></style>