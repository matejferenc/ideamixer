import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Home from './pages/Home.vue'
import RandomIdea from './pages/RandomIdea.vue'
import MyIdea from './pages/MyIdea.vue'
import History from './pages/History.vue'
import Explore from './pages/Explore.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/random', component: RandomIdea },
  { path: '/my-idea', component: MyIdea },
  { path: '/history', component: History },
  { path: '/explore', component: Explore }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
