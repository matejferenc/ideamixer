<template>
  <div id="app">
    <h1>Proposal Idea</h1>

    <div id="ideas">
	    <h2>
	    	Can you combine<br>
	    	<input id="word1" @blur="submitIdea();"></input>
	    	with
	    	<span id="word2"><strong>{{ word }}</strong></span>
	    	?
	    </h2>

	    <button @click="rate('1');" class="success">Good</button>
	    <button @click="rate('-1');" class="failure">Bad</button>
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
      word: ''
    }
  },
  methods: {
    getWord: function () {
      var vm = this
      axios.get('/idea/generateOne').then(function (response) {
        vm.word = response.data
        logGenerate1()
      })
    },
    rate: function (rating) {
      var vm = this
      var proposal = document.getElementById('word1').value
      axios.post('/idea/rate', querystring.stringify({
        rating: rating,
        words: [ proposal, vm.word ]
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function () {
        logRating(proposal + ', ' + vm.word, rating)
        vm.getWord()
      })
    },
    submitIdea() {
      var vm = this
      var proposal = document.getElementById('word1').value
      axios.post('/idea/submit', querystring.stringify({
        idea: proposal
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function () {
        logIdeaSubmit(proposal)
      })
    }
  },
  mounted () {
    this.getWord()
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

	#word1 {
    	font-weight: 400;
        font-family: 'Lato', sans-serif;
        font-size: 72px;

	}
</style>
