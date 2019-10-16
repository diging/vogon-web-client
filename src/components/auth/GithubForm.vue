<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="loginForm" v-model="valid")
					v-card-title#title Github Authorization
					v-card-text
						a(href="https://github.com/login/oauth/authorize?scope=user&client_id=ba7c54943f8cbf9f3ab4") authorize
					v-card-actions

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios'
@Component({
  name: 'GithubForm',
})
export default class GithubForm extends Vue {
  private password: string = '';
  private username: string = '';
  private error: boolean = false;

  private valid: boolean = false;
  private gits: null;

mounted() {
	if(this.$route.query.code){
		console.log("Works");
		this.getAccessToken();
	}
}

getAccessToken() {
	Vue.$axios.get('snippet/', {
		params: {
			code: this.$route.query.code
		}
	})
	.then((result) => {
		console.log(result.data)
	})
	.catch((error) => {
		// TODO: deal with errors
		this.error = true;
	});
}

  public async login(): Promise<void> {
	if ((this.$refs.loginForm as VForm).validate()) {
	Vue.$axios.post('api/token/',
	{
		username: this.username,
		password: this.password,
		
	})
	.then((result) => {
		localStorage.setItem('token', result.data.access);
		Vue.$axios.defaults.headers.common.Authorization = `Bearer ${result.data.token}`;
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