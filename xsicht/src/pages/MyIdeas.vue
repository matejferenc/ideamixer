<template>
  <div id="app">
    <h1>My Ideas</h1>
    <span>{{ history }}</span>
    <ul id="ideas">
      <li v-for="item in history">
        {{ item.words[0] }} with {{ item.words[1] }} {{ item.rating = '1' ? 'GOOD' : 'BAD' }}
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-new */
/* global logShowHistory */

import axios from 'axios'

module.exports = {
  data: function () {
    return {
      history: []
    }
  },
  methods: {
    showHistory: function () {
      var vm = this
      axios.get('/idea/history').then(function (response) {
        vm.history = response.data
        logShowHistory()
      })
    }
  },
  mounted () {
    this.showHistory()
  }
}
</script>
