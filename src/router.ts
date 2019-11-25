import Vue from 'vue';
import Router from 'vue-router';

import GithubView from './views/auth/GithubView.vue';
import LoginView from './views/auth/LoginView.vue';
import SignUpView from './views/auth/SignUpView.vue';

import Annotations from './views/annotations/Annotations.vue';
import ConceptDetails from './views/concepts/ConceptDetails.vue';
import ConceptList from './views/concepts/ConceptList.vue';
import Contributors from './views/Contributors.vue';
import Dashboard from './views/dashboard/Dashboard.vue';
import Home from './views/Home.vue';
import About from './views/info/About.vue';
import ProjectDetails from './views/project/ProjectDetails.vue';
import ProjectList from './views/project/ProjectList.vue';
import CollectionDetails from './views/texts/CollectionDetails.vue';
import RepoDetails from './views/texts/RepoDetails.vue';
import RepoList from './views/texts/RepoList.vue';
import TextDetails from './views/texts/TextDetails.vue';

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
			path: '/dashboard',
			name: 'dashboard',
			component: Dashboard,
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
			path: '/repository/:repoId/text/:textId',
			name: 'text-details',
			component: TextDetails,
		},
		{
			path: '/concept',
			name: 'concept-list',
			component: ConceptList,
		},
		{
			path: '/concept/:id',
			name: 'concept-details',
			component: ConceptDetails,
		},
		{
			path: '/relations',
			name: 'annotation-list',
			component: Annotations,
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
