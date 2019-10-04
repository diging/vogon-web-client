import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Contributors from './views/Contributors.vue';
import About from './views/info/About.vue';
import ProjectList from './views/project/ProjectList.vue';
import ProjectDetails from './views/project/ProjectDetails.vue';
import LoginView from './views/auth/LoginView.vue';

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
  ],
});
