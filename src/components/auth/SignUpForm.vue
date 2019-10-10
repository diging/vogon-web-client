<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="signUpForm" v-model="valid")
					v-card-title#title Sign Up
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
						v-text-field(label="Password" required outlined password :type="show1 ? 'text' : 'password'" v-model="password" :rules="[() => !!password || 'Password Required.']")
						v-text-field(label="Password Confirmation" required outlined password :type="show1 ? 'text' : 'password'" v-model="passwordConfirmation" :rules="[() => !!passwordConfirmation || 'Password Confirmation Required.']")
						v-text-field(class="mt-4" label="Full Name" required outlined v-model="fullName" :rules="[() => !!fullName || 'Full Name Required.']")
						v-text-field(class="mt-4" label="Email" required outlined v-model="email" :rules="[() => !!email || 'Email Required.']")
						v-text-field(class="mt-4" label="affiliation" required outlined v-model="affiliation" :rules="[() => !!affiliation|| 'Affiliation Required.']")
					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="signUp") Sign Up
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'SignUpForm',
})
export default class Login extends Vue {
  private password: string = '';
  private username: string = '';
  private passwordConfirmation: string = '';
  private fullName: string = '';
  private email: string = '';
  private affiliation: string = '';
  private error: boolean = false;

  private valid: boolean = false;

  public async signUp(): Promise<void> {
	if ((this.$refs.signUpForm as VForm).validate()) {
	axios.post('http://127.0.0.1:8000/api/v2/users',
	{
		username: this.username,
		password: this.password,
		full_name: this.fullName,
		email: this.email,
		affiliation: this.affiliation,
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