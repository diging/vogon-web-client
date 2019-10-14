import Vue from 'vue';
import Router from 'vue-router';

import GithubView from './views/auth/GithubView.vue';
import LoginView from './views/auth/LoginView.vue';
import SignUpView from './views/auth/SignUpView.vue';

import Contributors from './views/Contributors.vue';
import Home from './views/Home.vue';
import About from './views/info/About.vue';
import ProjectDetails from './views/project/ProjectDetails.vue';
import ProjectList from './views/project/ProjectList.vue';
import CollectionDetails from './views/texts/CollectionDetails.vue';
import RepoDetails from './views/texts/RepoDetails.vue';
import RepoList from './views/texts/RepoList.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/project',
			name: 'project',
			component: ProjectList,
		},
		{
			path: '/project/:id',
			name: 'project-details',
			component: ProjectDetails,
		},
		{
			path: '/repository',
			name: 'repo-list',
			component: RepoList,
		},
		{
			path: '/repository/:id',
			name: 'repo-details',
			component: RepoDetails,
		},
		{
			path: '/repository/:repoId/collections/:colId',
			name: 'collection-details',
			component: CollectionDetails,
		},
		{
			path: '/contributors',
			name: 'contributors',
			component: Contributors,
		},
		{
			path: '/about',
			name: 'about',
			component: About,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUpView,
		},
		{
			path: '/github',
			name: 'github',
			component: GithubView,
		},
	],
});
