<template>
  <div id="app">
    <h1>My Ideas</h1>
    <span>{{ history }}</span>
    <ul id="ideas">
      <li v-for="item in history">
        {{ item.words[0] }}
        with
        {{ item.words[1] }}

        {{#if item.rating == '-1'}}
            <button class="failure" disabled="disabled">Bad</button>
            <button @click="rate(item.words, '1');" class="success">Good</button>
        {{/if}}
        {{#if item.rating == '1'}}
            <button class="success" disabled="disabled">Good</button>
            <button @click="rate(item.words, '-1');" class="failure">Bad</button>
        {{/if}}
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-new */
/* global logShowHistory */

import axios from 'axios'
import querystring from 'querystring'

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

<style>

	.success, .failure {
		display: inline-block;
		width: auto;
		color: #fff;
		padding: 5px 15px;
		text-decoration: none;
		transition: all .2s ease-in-out;
		font-size: 18px;
    outline: 0;
    border: 0;
    cursor: pointer;
	}

	.success {
		background: #79d1ad;
	}

	.success:hover {
		background: #41bd8a;
	}

	.failure {
		margin-left: 20px;
		background: #e67478;
	}

	.failure:hover {
		background: #da3339;
	}
</style>