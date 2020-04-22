import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

import LoginForm from '@/components/auth/LoginForm.vue';

// jest.mock('axios')

describe('LoginForm.vue', () => {
  let wrapper: any;
  let vuetify: any;
  let router: any;
  Vue.use(Vuetify);
  Vue.use(VueRouter);

  beforeEach(() => {
	const localVue = createLocalVue();
	router = new VueRouter();
	vuetify = new Vuetify();

	wrapper = mount(LoginForm, {
		localVue,
		router,
		vuetify,
		mocks: {},
	});
  });

  it('should log in successfully', async () => {

	wrapper.setData({ valid: true });
	wrapper.setData({ password: 'tr' });
	wrapper.setData({ username: 'tr' });

	const loginBtn = wrapper.find('.v-btn');
	await loginBtn.trigger('click');
	// expect((wrapper.vm as any).$root.$data.loggedIn).toBe(true);
  });
});
