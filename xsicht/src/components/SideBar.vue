<template>
	<div class="sidebar">
		<div id="mobile-nav" class="r90">
			<i class="fa fa-bars fa-2x" aria-hidden="true"></i>
		</div>

		<nav>
			<p class="nav-title as-h5"><i class="fa fa-lightbulb-o" aria-hidden="true"></i></p>

			<hr class="mobile-hidden">

			<ul class="menu">
				<router-link tag="li" to="/" exact><a>Home</a></router-link>
				<li><router-link to="/random/">Random</router-link></li>
				<li><router-link to="/my-idea">My Idea</router-link></li>
				<li><router-link to="/history">History</router-link></li>
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
	#mobile-nav.active {
		color: #fff;
	}

	#mobile-nav i {
		position: fixed;
		top: 30px;
		left: 36px;
		z-index: 30;
	    transition: .2s ease-in-out all;
	}

	#mobile-nav.active i {
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
		padding-left: 1em;
    	font-size: 1.5em;
		-webkit-transition: all .5s;
		-o-transition: all .5s;
		transition: all .5s;
	}

	.menu a:hover {
		margin-left: 1em;
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
		padding-top: 2em;
		box-sizing: border-box;
		z-index: 20;
		height: 100%;
		-webkit-transition: all .3s;
		-o-transition: all .3s;
		transition: all .3s;
	}

	nav.active { left: 0; }

	nav .nav-title {
		color: #ddd;
		padding-left: 1em;
		text-transform: uppercase;
	}

	nav hr {
		margin: 1em 2em;
		background: #ddd;
	}

	@media screen and (max-width: 759px) {
		#mobile-nav {
			cursor: pointer;
			position: fixed;
			top: 0;
			background: rgba(255,255,255,1);
			height: 4em;
			left: 0;
			right: 0;
			display: block;
			text-align: left;
			padding: 1em 2em;
			width: 100%;
			z-index: 30;
			box-shadow: 0 0 15px 0 rgba(0,0,0,0.25);
			transition: .2s ease-in-out all;
		}

		#mobile-nav.active {
			background: rgba(255,255,255,0);
			box-shadow: 0 0 15px 0 rgba(0,0,0,0);
		}

		#mobile-nav i {
	    	position: static;
	    }

	    nav {
	    	padding-top: 5em;
	    }
	}
</style>
