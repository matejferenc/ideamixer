<template>
  <div id="app">
    <h1>Random Idea</h1>

    <hr>

    <div id="ideas">
	    <p class="as-h3">Can you combine</p>
    	<p class="as-h2 thick">{{ words[0] }}</p>
    	<p class="as-h3">with</p>
    	<p class="as-h2 thick">{{ words[1] }}</p>
	    <p class="as-h3">?</p>

      <div class="buttonset">
  	    <button @click="rate('1');" class="success">Good</button>
  	    <button @click="rate('-1');" class="failure">Bad</button>
      </div>
    </div>
  </div>
</template>

<script>
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
        logRating(vm.words[0] + ', ' + vm.words[1], rating)
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
	p {
    margin: 0;
  }

  .buttonset {
    margin: 2em 0;
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
