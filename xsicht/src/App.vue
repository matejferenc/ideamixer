<template>
<div class="main">
    <side-bar></side-bar>

    <router-view></router-view>
</div>
</template>

<script>
import SideBar from 'components/SideBar'

export default {
  name: 'app',
  components: {SideBar}
}
</script>

<style>
#app {
  padding: 0 280px;
}
</style>