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
		return decoded.user_id;
	}
	return null;
}

export function getCurrentUser() {
	const userId = getUserId();
	return Vue.$axios.get(`/users/${userId}`).then(response => response.data)
}

export default {
	getConceptStateTheme,
	getUserId,
	getCurrentUser,
};
