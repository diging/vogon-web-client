<template lang="pug">
	div(class="main")
		h2(class="display-1") Contributors
		br
		v-data-table(
			:headers="headers" :items="users" :loading="loading" class="elevation-1" dense
			:server-items-length="usersCount" v-on:pagination="(p) => getUsers(p.page)" :page.sync="page" 
			:items-per-page="PAGE_SIZE" :footer-props="{'items-per-page-options':['', PAGE_SIZE]}"
		)
			template(v-slot:top)
				div(class="user_header")
					v-form(ref="searchForm")
						v-row
							v-col(md="6")
								v-text-field(v-model="search" label="Type username or full name..." outlined dense clearable  v-on:keydown.enter.prevent="() => { page = 1; getUsers() }")
						v-btn(depressed color="primary" @click="() => { page = 1; getUsers() }") Search

			template(v-slot:loading)
				br
				div Loading users ...
				br

			template(v-slot:no-data)
				ErrorIndicator(v-if="error") Error while loading users!
				EmptyView(v-else) No users found!

			template(v-slot:item.user="{ item }")
				div(class="user-detail-container")
					v-list-item-avatar
						template(v-if="item.imagefile")
							v-img(:src="item.imagefile")
						template(v-else)
							v-icon(x-large) mdi-account-circle
					div
						a(class="body-1 font-weight-bold user-link" v-bind:href="`/users/${item.id}`") {{ item.username }}
							span(v-if="item.full_name" class="font-weight-light grey--text text--darken-1 subtitle-2") 
								| &nbsp; | {{ item.full_name }}
						h5(class="subtitle-2 .font-weight-light") {{ item.email }}
						h5(v-if="item.affiliation" class="body-2 lime--text text--darken-4 font-weight-medium") {{ item.affiliation }}
						h5(v-if="item.location" class="body-2") {{ item.location }}

			template(v-slot:item.contributions="{ item }")
				div
					| {{ item.annotation_count }} appellation(s),
					| {{ item.relation_count }} relation(s),
					| {{ item.text_count }} text(s)

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { PAGE_SIZE } from '@/constants';
import { User } from '@/interfaces/GlobalTypes';

@Component({
	name: 'UserList',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class UserList extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private users: User[] = [];
	private usersCount: number = 0;

	private page: number = 1;
	private PAGE_SIZE: number = PAGE_SIZE;
	private search: string = '';

	private headers = [
		{text: 'User', value: 'user' },
		{text: 'Contributions', value: 'contributions'},
	];

	public mounted(): void {
		this.getUsers();
	}

	public async getUsers(page: number = 1): Promise<void> {
		this.loading = true;
		const params = {
			search: this.search,
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE,
		};
		Vue.$axios.get('/users', { params })
			.then((response: AxiosResponse) => {
				this.users = response.data.results;
				this.usersCount = response.data.count;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.user_header {
	padding: 16px;
}
.user-detail-container {
	padding: 16px;
	align-items: center;
    display: flex;
    flex: 1 1 100%;
}
.user-link {
	text-decoration: none;
	color: inherit;
}
</style>