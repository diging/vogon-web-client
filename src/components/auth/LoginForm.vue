<template lang="pug">
v-row
	v-col.offset-2(cols="8" align="center" justify="center")
		v-card.mt-5
			v-form(ref="loginForm" v-model="valid")
				v-card-title#title Login
				v-card-text
					v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
				v-alert(v-if="error" v-model="error" type="error" dense dismissible class="mx-4")
					| Error while logging in: {{ errorMsg }}

				v-card-actions()
					div(class="flex-grow-1")    
					v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="login") Login

				div.mt-2.pb-4.px-2.text-center Don't have an account?
					router-link(to="/signup" class="mx-2") Signup
					| for one
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import JwtDecode from 'jwt-decode'
import { Component, Vue } from 'vue-property-decorator'

import { TokenDto, VForm } from '@/interfaces/GlobalTypes'
import { getUserId } from '@/utils'
import Loading from '@/components/global/Loading.vue'

@Component({
	name: 'LoginForm',
})
export default class Login extends Vue {
	private username: string = ''
	private show: boolean = false
	private error: boolean = false
	private errorMsg: string = ''
	private user: any = ''
	private loading: boolean = true
	private valid: boolean = false

	public async login(): Promise<void> {
		this.error = false
		if ((this.$refs.loginForm as VForm).validate()) {
			const payload = {
				username: this.username,
			};
			Vue.$axios.post('token/', payload)
				.then( (response: AxiosResponse) => {
					this.$root.$data.loggedIn = true
					localStorage.setItem('token', response.data.access)
					localStorage.setItem('is_admin', response.data.is_admin)
					Vue.$axios.defaults.headers.common.Authorization = `Bearer ${response.data.access}`
					const decoded = JwtDecode<TokenDto>(response.data.access)
					const userId = this.$utils.getUserId()
					const token: any = localStorage.getItem('token')
					const payload = {
						username: this.username,
						token: token,
					};
					if (decoded.citesphere_token) {
						this.$router.push({name: 'dashboard'})
					} else {
						this.$router.push({name: 'citesphere-auth'})
					}
					window.location.reload()
				})
				.catch((error: AxiosError) => {
					this.error = true
					if (error.response && error.response.data && error.response.data.detail) {
						this.errorMsg = error.response.data.detail
					} else {
						if (error.response) {
							this.errorMsg = error.response.data
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
