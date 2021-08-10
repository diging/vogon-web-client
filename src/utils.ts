import JwtDecode from 'jwt-decode';

import { TokenDto } from '@/interfaces/GlobalTypes';
import Vue from 'vue';

export function getConceptStateTheme(state: string): {color: string, icon: string} {
	const mapping: {[key: string]: {color: string, icon: string}} = {
		Approved: { color: 'green', icon: 'mdi-thumb-up-outline'},
		Pending: { color: 'orange lighten-1', icon: 'mdi-timer-sand-empty'},
		Merged: { color: 'indigo darken-1', icon: 'mdi-merge'},
		Rejected: { color: 'red darken-1', icon: 'mdi-thumb-down-outline'},
		Resolved: { color: 'teal lighten-1', icon: 'mdi-check-circle-outline'},
	};
	return mapping[state];
}

export function getUserId() {
	const token = localStorage.getItem('token');
	if (token) {
		const decoded = JwtDecode<TokenDto>(token);
		console.log("this.decoded", decoded);
		return decoded.user_id;
	}
	return null;
}

export function getCurrentUser() {
	const userId = getUserId();
		Vue.$axios.get(`/users/${userId}`)
			.then((response: AxiosResponse) => {
				const user = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	return user;	
}

export function isAdmin() {
	const user = getCurrentUser();
	if (user!=null) {
		return user.is_admin;
	}
}

export default {
	getConceptStateTheme,
	getUserId,
};
