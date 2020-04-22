import LoginForm from '@/components/auth/LoginForm.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
// jest.mock('axios')


describe('LoginForm.vue', () => {
  let wrapper: any;
  let vuetify: any;
  Vue.use(Vuetify);

  beforeEach(() => {
	const localVue = createLocalVue();
	vuetify = new Vuetify();
	// localVue.use(Vuetify);

	wrapper = mount(LoginForm, {
		localVue,
		vuetify,
	});
  });

  it('should log in successfully', async () => {

	wrapper.setData({ valid: true });
	wrapper.setData({ password: 'tr' });
	wrapper.setData({ username: 'tr' });
	// console.log(wrapper.find('.v-btn').props());
	await wrapper.find('.v-btn').trigger('click');
	expect((wrapper.vm as any).$root.$data.loggedIn).toBe(true);
  });
});
