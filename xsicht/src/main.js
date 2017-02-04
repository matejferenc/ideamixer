import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Home from './pages/Home.vue'
import RandomIdea from './pages/RandomIdea.vue'
import ProposalIdea from './pages/ProposalIdea.vue'
import MyIdeas from './pages/MyIdeas.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/random/:ideaId?', component: RandomIdea },
  { path: '/proposal', component: ProposalIdea },
  { path: '/my-ideas', component: MyIdeas }
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