<template>
  <div id="app">
    <h1>Random Idea</h1>

    <div id="ideas">
	    <h2>
	    	Can you combine<br>
	    	<span id="word1"><strong>Lorem</strong></span>
	    	with
	    	<span id="word2"><strong>Ipsum</strong></span>
	    	?
	    </h2>

	    <a href="#" onclick="rate('GOOD');" class="success">Good</a>
	    <a href="#" onclick="rate('BAD');" class="failure">Bad</a>
    </div>
  </div>
</template>

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
