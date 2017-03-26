<template>
  <div id="app" onload="init()">
    <h1>My Idea</h1>
    
    <hr>

    <div id="ideas">
	    <p class="as-h3">Can you combine</p>
	    <input id="my-idea" class="as-h2 thick" @blur="submitIdea();" placeholder="My great idea..." autofocus>
	    <p class="as-h3">with</p>
	    <p class="as-h2 thick">{{ word }}</p>
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
      var proposal = document.getElementById('my-idea').value
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
      var proposal = document.getElementById('my-idea').value
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
  
  input {
    font-family: 'Titillium Web', sans-serif;
    background: transparent;
    text-align: center;
    width: 100%;
    height: 1.5em;
    white-space: normal;
    -moz-text-align-last: center;
    text-align-last: center;
    resize: none;
    border: 0 none white;
    overflow: hidden;
    padding: 0;
    outline: none;
  }
</style>
