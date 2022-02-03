<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="resetPasswordForm" v-model="valid" v-on:keyup.enter.native="reset")
					v-card-title#title Reset Password
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
							:rules="[() => !!passwordConfirmation || 'Password Confirmation Required.',() => passwordConfirmation == password || 'Passwords should match']" 
							:append-icon="show2 ? 'visibility' : 'visibility_off'" 
							@click:append="show2 = !show2"
						)
					v-alert(v-if="msg" :value="!!msg" v-model="msg" :type="msgType" dense dismissible class="mx-4") {{ msg }}

					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="reset" :loading="loading") Reset password

</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'ResetPasswordView',
})
export default class ResetPasswordView extends Vue {
	private username: string = '';
	private password: string = '';
	private passwordConfirmation: string = '';

	private msg: string = '';
	private msgType: string = 'primary';
	private loading: boolean = false;
	private valid: boolean = false;

	private show1: boolean = false;
	private show2: boolean = false;

	private reset() {
		this.msg = '';
		this.loading = true;

		const payload = {
			username: this.username,
			password1: this.password,
			password2: this.passwordConfirmation,
			token: this.$route.params.token,
		};
		console.log("params", this.$route.params.token);
		console.log("payload", payload);
		Vue.$axios.post('/reset-password/', payload)
			.then((response: AxiosResponse) => {
				this.msg = 'Successfully reset the password! Kindly login again...';
				this.msgType = 'primary';
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.msg = error.response.data.message;
				} else {
					this.msg = `Error while performing request - ${error.message}`;
				}
				this.msgType = 'error';
			})
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
#title {
	background: grey;
}
</style>