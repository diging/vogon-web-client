import LoginForm from '@/components/auth/LoginForm.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
// jest.mock('axios')

const localVue = createLocalVue();

describe('LoginForm.vue', () => {
  let vuetify: any;

  beforeEach(() => {
	vuetify = new Vuetify();
  });

  it('should log in successfully', async () => {
	const wrapper = mount(LoginForm, {
		vuetify,
		localVue,
	});
	wrapper.setData({ valid: true });
	wrapper.setData({ password: 'tr' });
	wrapper.setData({ username: 'tr' });
	await wrapper.find('v-btn').trigger('click');
	expect((wrapper.vm as any).$root.$data.loggedIn).toBe(true);
  });
});
