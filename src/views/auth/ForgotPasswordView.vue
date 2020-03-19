<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="forgotPasswordForm" v-model="valid" v-on:keyup.enter.native="forgot")
					v-card-title#title Forgot Password
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
					v-alert(v-if="msg" :value="!!msg" v-model="msg" :type="msgType" dense dismissible class="mx-4") {{ msg }}

					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="forgot" :loading="loading") Get reset link

</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'ForgotPasswordView',
})
export default class ForgotPasswordView extends Vue {
	private username: string = '';
	private msg: string = '';
	private msgType: string = 'primary';
	private loading: boolean = false;

	private valid: boolean = false;

	private forgot() {
		this.msg = '';
		this.loading = true;

		const payload = {
			username: this.username,
		};
		Vue.$axios.post('/forgot-password/', payload)
			.then((response: AxiosResponse) => {
				this.msg = 'Reset link has been mailed to you! Please check';
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