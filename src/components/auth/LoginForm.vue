<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="loginForm" v-model="valid" v-on:keyup.enter.native="login")
					v-card-title#title Login
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
						v-text-field(label="Password" required outlined password :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility' : 'visibility_off'" @click:append="show = !show" v-model="password" :rules="[() => !!password || 'Password Required.']")
					v-alert(v-if="error" v-model="error" type="error" dense dismissible class="mx-4")
						| Error while logging in: {{ errorMsg }}

					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="login") Login

				div(class="my-2") Don't have an account?
					a(href="/signup" class="mx-2") Signup
					| for one
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import JwtDecode from 'jwt-decode';
import { Component, Vue } from 'vue-property-decorator';

import { TokenDto, VForm } from '@/interfaces/GlobalTypes';

@Component({
	name: 'LoginForm',
})
export default class Login extends Vue {
	private password: string = '';
	private username: string = '';
	private show: boolean = false;
	private error: boolean = false;
	private errorMsg: string = '';

	private valid: boolean = false;

	public async login(): Promise<void> {
		this.error = false;
		if ((this.$refs.loginForm as VForm).validate()) {
			const payload = {
				username: this.username,
				password: this.password,
			};
			Vue.$axios.post('token/', payload)
				.then((response: AxiosResponse) => {
					this.$root.$data.loggedIn = true;
					localStorage.setItem('token', response.data.access);
					Vue.$axios.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
					const decoded = JwtDecode<TokenDto>(response.data.access);
					if (decoded.github_token) {
						this.$router.push('dashboard');
					} else {
						this.$router.push('github');
					}
				})
				.catch((error: AxiosError) => {
					this.error = true;
					if (error.response && error.response.data && error.response.data.detail) {
						this.errorMsg = error.response.data.detail;
					} else {
						this.errorMsg = error.message;
					}
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