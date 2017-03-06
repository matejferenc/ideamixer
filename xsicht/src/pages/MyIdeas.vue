<template>
  <div id="app">
    <h1>My Ideas</h1>
    <ul id="ideas">
      <li v-for="item in history">
        {{ item.words[0] }}
        with
        {{ item.words[1] }}

        <span v-if="item.rating == '1'">
            <span class="successRated">Good</span>
            <button @click="rate(item.words, '-1');" class="failure">Bad</button>
        </span>
        <span v-else>
            <button @click="rate(item.words, '1');" class="success">Good</button>
            <span class="failureRated">Bad</span>
        </span>
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

	.successRated {
	  color: #79d1ad;
	  font-size: 18px;
	}

	.success:hover {
		background: #41bd8a;
	}

	.failure {
		background: #e67478;
	}

	.failureRated {
	  color: #e67478;
	  font-size: 18px;
	}

	.failure:hover {
		background: #da3339;
	}

	ul {
    list-style-type: none;
    list-style:none;
    padding: 0;
    margin: 0;
  }
</style>
