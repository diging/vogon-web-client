<template lang="pug">
v-row(align="center" justify="center")
	v-col(cols="6")
		v-card
			v-form(ref="signUpForm" v-model="valid")
				v-card-title#title Sign Up
				v-card-text
					v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
					v-text-field(class="mt-4" label="Full Name" required outlined v-model="fullName" :rules="[() => !!fullName || 'Full Name Required.']")
					v-text-field(class="mt-4" label="Email" required outlined v-model="email" :rules="[() => !!email || 'Email Required.',v => /.+@.+\..+/.test(v) || 'E-mail must be valid']")
					v-text-field(class="mt-4" label="Affiliation" required outlined v-model="affiliation" :rules="[() => !!affiliation|| 'Affiliation Required.']")

				v-alert(v-if="error" v-model="error" type="error" dense dismissible class="mx-4")
					| Error while signing up: {{ errorMsg }}

				v-card-actions()
					div(class="flex-grow-1")    
					v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="signUp") Sign Up

				div.my-2.pb-4.text-center Have an account?
					router-link(to="/login" class="mx-2") Login
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
			Vue.$axios.post('/create-user/', {
				username: this.username,
				full_name: this.fullName,
				email: this.email,
				affiliation: this.affiliation,
			})
			.then((response: AxiosResponse) => {
				const { access } = response.data;
				localStorage.setItem('token', access);
				Vue.$axios.defaults.headers.common.Authorization = `Bearer ${access}`;
				this.$router.push({name: 'citesphere-auth'});
			})
			.catch((error: AxiosError) => {
				this.error = true;
				if (error && error.response && error.response.status === 412) {
					this.errorMsg = String(error.response.data[0])
					for (let i = 1; i < error.response.data.length; i++) {
						this.errorMsg = this.errorMsg.concat(String(error.response.data[i]))
					}
				} else {
					if (error.response) {
						this.errorMsg = 'User could not be created';
					}
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