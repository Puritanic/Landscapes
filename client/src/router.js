import Vue from 'vue';
import Router from 'vue-router';

import AuthGuard from './utils/AuthGuard';

import Home from './components/Home';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Profile from './components/Auth/Profile';
import AddPost from './components/Posts/AddPost';
import Posts from './components/Posts/Posts';

Vue.use(Router);

export default new Router({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/posts',
			name: 'Posts',
			component: Posts,
		},
		{
			path: '/post/add',
			name: 'AddPost',
			component: AddPost,
		},
		{
			path: '/profile',
			name: 'Profile',
			component: Profile,
			beforeEnter: AuthGuard,
		},
		{
			path: '/signin',
			name: 'Signin',
			component: Signin,
		},
		{
			path: '/signup',
			name: 'Signup',
			component: Signup,
		},
	],
});
