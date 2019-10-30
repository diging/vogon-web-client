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
