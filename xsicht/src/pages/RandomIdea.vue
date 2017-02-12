<template>
  <div id="app">
    <h1>Random Idea</h1>

    <div id="ideas">
	    <h2>
	    	Can you combine<br>
	    	<span id="word1"><strong>{{ words[0] }}</strong></span>
	    	with
	    	<span id="word2"><strong>{{ words[1] }}</strong></span>
	    	?
	    </h2>

	    <button @click="rate('GOOD');" class="success">Good</button>
	    <button @click="rate('BAD');" class="failure">Bad</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new */
/* global logGenerate2, logRating */

import axios from 'axios'
import querystring from 'querystring'

module.exports = {
  data: function () {
    return {
      words: []
    }
  },
  methods: {
    getWords: function () {
      var vm = this
      axios.get('/idea/generate').then(function (response) {
        vm.words = response.data
        logGenerate2()
      })
    },
    rate: function (rating) {
      var vm = this
      axios.post('/idea/rate', querystring.stringify({
        rating: rating,
        words: vm.words
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function () {
        logRating(vm.words[0] + ', ' + vm.words[1], (rating === 'GOOD') ? 1 : -1)
        vm.getWords()
      })
    }
  },
  mounted () {
    this.getWords()
  }
}
</script>

<style>
	h2 {
		font-weight: 400;
	}

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
