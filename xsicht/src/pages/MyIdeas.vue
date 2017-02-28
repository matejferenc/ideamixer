<template>
  <div id="app">
    <h1>My Ideas</h1>
    <span>{{ history }}</span>
    <ul id="ideas">
      <li v-for="item in history">
        {{ item.words[0] }}
        with
        {{ item.words[1] }}
        {{ item.rating == '1' ?
            <button @click="rate(item.words, '1');" class="success">Good</button> :
            <button @click="rate(item.words, '-1');" class="failure">Bad</button> }}
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
    },
    rate: function (words, rating) {
      var vm = this
      axios.post('/idea/rate', querystring.stringify({
        rating: rating,
        words: words
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function () {
        logRating(words[0] + ', ' + words[1], rating)
        vm.showHistory()
      })
    }
  },
  mounted () {
    this.showHistory()
  }
}
</script>
