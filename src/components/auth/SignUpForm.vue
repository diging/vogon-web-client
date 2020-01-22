<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="signUpForm" v-model="valid")
					v-card-title#title Sign Up
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
						v-text-field(
							label="Password"
							required 
							outlined 
							password 
							:type="show1 ? 'text' : 'password'" 
							v-model="password" 
							:rules="[() => !!password || 'Password Required.']"
							:append-icon="show1 ? 'visibility' : 'visibility_off'" 
							@click:append="show1 = !show1"
						)
						v-text-field(
							label="Password Confirmation" 
							required outlined password :type="show2 ? 'text' : 'password'" 
							v-model="passwordConfirmation" 
							:rules="[() => !!passwordConfirmation || 'Password Confirmation Required.']" 
							:append-icon="show2 ? 'visibility' : 'visibility_off'" 
							@click:append="show2 = !show2"
						)
						v-text-field(class="mt-4" label="Full Name" required outlined v-model="fullName" :rules="[() => !!fullName || 'Full Name Required.']")
						v-text-field(class="mt-4" label="Email" required outlined v-model="email" :rules="[() => !!email || 'Email Required.']")
						v-text-field(class="mt-4" label="Affiliation" required outlined v-model="affiliation" :rules="[() => !!affiliation|| 'Affiliation Required.']")

					v-alert(v-if="error" v-model="error" type="error" dense dismissible class="mx-4")
						| Error while signing up: {{ errorMsg }}

					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="signUp") Sign Up

					div(class="my-2") Have an account?
						a(href="/login" class="mx-2") Login
						| instead
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import { VForm } from '@/interfaces/GlobalTypes';

@Component({
	name: 'SignUpForm',
})
export default class Login extends Vue {
	private password: string = '';
	private username: string = '';
	private passwordConfirmation: string = '';
	private show1: boolean = false;
	private show2: boolean = false;
	private fullName: string = '';
	private email: string = '';
	private affiliation: string = '';
	private error: boolean = false;
	private errorMsg: string = '';

	private valid: boolean = false;

	public async signUp(): Promise<void> {
		this.error = false;
		if ((this.$refs.signUpForm as VForm).validate()) {
			Vue.$axios.post('/users', {
				username: this.username,
				password: this.password,
				full_name: this.fullName,
				email: this.email,
				affiliation: this.affiliation,
			})
			.then((response: AxiosResponse) => {
				this.$router.push('/login');
			})
			.catch((error: AxiosError) => {
				this.error = true;
				this.errorMsg = error.message;
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