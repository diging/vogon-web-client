import Vue from 'vue';
import Router from 'vue-router';

import CitesphereAuthView from './views/auth/CitesphereAuthView.vue';
import ForgotPasswordView from './views/auth/ForgotPasswordView.vue';
import GithubView from './views/auth/GithubView.vue';
import LoginView from './views/auth/LoginView.vue';
import ResetPasswordView from './views/auth/ResetPasswordView.vue';
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
import CollectionDetails from './views/texts/amphora/CollectionDetails.vue';
import RepoDetails from './views/texts/amphora/RepoDetails.vue';
import TextContent from './views/texts/amphora/TextContent.vue';
import TextDetails from './views/texts/amphora/TextDetails.vue';
import CitesphereGroupDetails from './views/texts/citesphere/CitesphereGroupDetails.vue';
import CitesphereRepoDeatils from './views/texts/citesphere/CitesphereRepoDeatils.vue';
import CitesphereTextDetails from './views/texts/citesphere/CitesphereTextDetails.vue';
import ItemDetails from './views/texts/citesphere/ItemDetails.vue';
import RepoList from './views/texts/RepoList.vue';
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
			path: '/repository/amphora/:id',
			name: 'amphora-repo-details',
			component: RepoDetails,
		},
		{
			path: '/repository/amphora/:repoId/collections/:colId',
			name: 'amphora-collection-details',
			component: CollectionDetails,
		},
		{
			path: '/repository/amphora/:repoId/text/:textId',
			name: 'amphora-text-details',
			component: TextDetails,
		},
		{
			path: '/repository/:repoName/:repoId/text/:textId/content/:contentId',
			name: 'amphora-text-content',
			component: TextContent,
		},
		{
			path: '/repository/citesphere/:id',
			name: 'citesphere-repo-details',
			component: CitesphereRepoDeatils,
		},
		{
			path: '/repository/citesphere/:repoId/groups/:groupId',
			name: 'citesphere-group-details',
			component: CitesphereGroupDetails,
		},
		{
			path: '/repository/:repoName/:repoId/groups/:groupId/items/:itemId/texts/:textId',
			name: 'citesphere-text-details',
			component: CitesphereTextDetails,
		},
		{
			path: '/repository/:repoName/:repoId/groups/:groupId/items/:itemId/item',
			name: 'citesphere-item-details',
			component: ItemDetails,
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
			path: '/forgot-password',
			name: 'forgot-password',
			component: ForgotPasswordView,
		},
		{
			path: '/reset-password/:token',
			name: 'reset-password',
			component: ResetPasswordView,
		},
		{
			path: '/github',
			name: 'github',
			component: GithubView,
		},
		{
			path: '/auth/citesphere',
			name: 'citesphere-auth',
			component: CitesphereAuthView,
		},
		{
			path: '/annotate/:id',
			name: 'annotate-text',
			component: TextView,
		},
	],
});
