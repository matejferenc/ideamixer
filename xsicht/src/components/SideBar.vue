<template>
	<div class="sidebar">
		<div id="mobile-nav" class="r90"><i class="fa fa-bars fa-2x" aria-hidden="true"></i></div>

		<nav>
			<ul class="menu">
				<router-link tag="li" to="/" exact><a>Home</a></router-link>
				<li><router-link to="/random/">Random</router-link></li>
				<li><router-link to="/proposal">Proposal</router-link></li>
				<li><router-link to="/my-ideas">MyIdeas</router-link></li>
				<li><router-link to="/explore">Explore</router-link></li>
			</ul>
		</nav>
	</div>
</template>

<script>
	export default {
	  name: 'SideBar'
	}
</script>

<style>
	#mobile-nav {
		cursor: pointer;
	    left: 3.5em;
	    height: 30px;
	    position: absolute;
	    top: 2em;
	    width: 30px;
	    z-index: 30;
	    transition: .2s ease-in-out all; 
	}

	#mobile-nav.active {
		color: #fff;
		transform: rotate(90deg);
	}

	.menu {
		list-style: none;
		line-height: 42px;
		margin: auto;
		padding-left: 0;
		width: 15em;
	}

	.menu a {
		color: #ddd;
		text-decoration: none;
		text-transform: uppercase;
		display: block;
		padding-left: 3em;
		width: 100%;
	}

	.menu a:hover {
		margin-left: 1em;
		-webkit-transition: all .5s;
		-o-transition: all .5s;
		transition: all .5s;
	}

	.menu li {
		box-shadow: 3px 0 #000 inset;
		margin-bottom: 5px;
		padding-left: .5em;
		-webkit-transition: all .5s;
		-o-transition: all .5s;
		transition: all .5s;
	}

	.menu li:hover {
	    box-shadow: 15em 0 rgba(0,0,0,.2) inset;
	}

	nav {
		background: url('/static/images/sidebar.png') 0 0 repeat;
		box-shadow: 0 0 8px 0px rgba(0,0,0,0.5);
	    position: fixed;
		left: -18em;
		top: 0;
		text-align: left;
		padding-top: 10em;
		box-sizing: border-box;
		z-index: 20;
		height: 100%;
		-webkit-transition: all .3s;
		-o-transition: all .3s;
		transition: all .3s;
	}

	nav.active { left: 0; }
</style>