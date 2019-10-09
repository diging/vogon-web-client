<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="loginForm" v-model="valid" v-on:keyup.enter.native="login")
					v-card-title#title Login
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
						v-text-field(label="Password" required outlined password :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility' : 'visibility_off'" @click:append="show = !show" v-model="password" :rules="[() => !!password || 'Password Required.']")
					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="login") Login
</template>

<script lang="ts">
import { TokenDto, VForm } from '@/interfaces/GlobalTypes';
import JwtDecode from 'jwt-decode';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'LoginForm',
})
export default class Login extends Vue {
  private password: string = '';
  private username: string = '';
  private show: boolean = false;
  private error: boolean = false;

  private valid: boolean = false;

  public async login(): Promise<void> {
	if ((this.$refs.loginForm as VForm).validate()) {
	Vue.$axios.post('/token/',
	{
		username: this.username,
		password: this.password,
	})
	.then((result) => {
		this.$root.$data.loggedIn = true;
		localStorage.setItem('token', result.data.access);
		Vue.$axios.defaults.headers.common.Authorization = `Bearer ${result.data.access}`;
		const decoded = JwtDecode<TokenDto>(result.data.access);
		if (decoded.github_token) {
			this.$router.push('home');
		} else {
			this.$router.push('github');
		}
	})
	.catch((error) => {
		// TODO: deal with errors
		this.error = true;

	});
	}
  }
}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
#title {
	background: grey;
}
</style>