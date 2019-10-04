<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="loginForm" v-model="valid")
					v-card-title#title Login
					v-card-text
						v-text-field(class="mt-4" label="Username" required outlined v-model="username" :rules="[() => !!username || 'Username Required.']")
						v-text-field(label="Password" required outlined password :type="show1 ? 'text' : 'password'" v-model="password" :rules="[() => !!password || 'Password Required.']")
					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="login") Login
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

import { VForm, Project, Text, PaginatedResult } from '@/models';

@Component({
  name: 'LoginForm',
})
export default class Login extends Vue {
  private password: string = '';
  private username: string = '';
  private loading: boolean = true;
  private error: boolean = false;

  private valid: boolean = false;

  public async login(): Promise<void> {
    if ((this.$refs.loginForm as VForm).validate()) {
      try {

      } catch (e) {

      } finally {

      }
    }
  }
}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
.loading {
	margin-top: 70px;
}
#title {
	background: grey;
}
</style>