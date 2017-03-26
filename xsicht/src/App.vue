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
* {
	box-sizing: border-box;
}

#app {
  padding: 0 280px;
}

@media only screen and (max-width: 759px) {
	#app {
		padding: 70px 20px 0;
	}
}
</style>