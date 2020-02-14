import Vue from 'vue';
import Router from 'vue-router';

import GithubView from './views/auth/GithubView.vue';
import LoginView from './views/auth/LoginView.vue';
import SignUpView from './views/auth/SignUpView.vue';

import Annotations from './views/annotations/Annotations.vue';
import ConceptAction from './views/concepts/ConceptAction.vue';
import ConceptDetails from './views/concepts/ConceptDetails.vue';
import ConceptEdit from './views/concepts/ConceptEdit.vue';
import ConceptList from './views/concepts/ConceptList.vue';
import ConceptTypeDetails from './views/concepts/ConceptTypeDetails.vue';
import ConceptTypes from './views/concepts/ConceptTypes.vue';
import Dashboard from './views/dashboard/Dashboard.vue';
import Home from './views/Home.vue';
import About from './views/info/About.vue';
import ProjectDetails from './views/project/ProjectDetails.vue';
import ProjectList from './views/project/ProjectList.vue';
import TemplateCreateOrUpdate from './views/templates/TemplateCreateOrUpdate.vue';
import TemplateList from './views/templates/TemplateList.vue';
import CollectionDetails from './views/texts/CollectionDetails.vue';
import RepoDetails from './views/texts/RepoDetails.vue';
import RepoList from './views/texts/RepoList.vue';
import TextContent from './views/texts/TextContent.vue';
import TextDetails from './views/texts/TextDetails.vue';
import TextView from './views/TextView.vue';
import UserDetail from './views/users/UserDetail.vue';
import UserList from './views/users/UserList.vue';

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
			path: '/repository/:repoId/text/:textId/content/:contentId',
			name: 'text-content',
			component: TextContent,
		},
		{
			path: '/concept',
			name: 'concept-list',
			component: ConceptList,
		},
		{
			path: '/types',
			component: ConceptTypes,
		},
		{
			path: '/types/:id',
			component: ConceptTypeDetails,
		},
		{
			path: '/concept/:id',
			name: 'concept-details',
			component: ConceptDetails,
		},
		{
			path: '/concept/:id/edit',
			name: 'concept-edit',
			component: ConceptEdit,
		},
		{
			path: '/concept/:id/:action',
			component: ConceptAction,
		},
		{
			path: '/relations',
			name: 'annotation-list',
			component: Annotations,
		},
		{
			path: '/users',
			name: 'user-list',
			component: UserList,
		},
		{
			path: '/users/:id',
			name: 'user-detail',
			component: UserDetail,
		},
		{
			path: '/relationtemplate',
			name: 'template-list',
			component: TemplateList,
		},
		{
			path: '/relationtemplate/add',
			name: 'template-create',
			component: TemplateCreateOrUpdate,
		},
		{
			path: '/relationtemplate/:id/edit',
			name: 'template-update',
			component: TemplateCreateOrUpdate,
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
		{
			path: '/annotate/:id',
			name: 'annotate-text',
			component: TextView,
		},
	],
});
