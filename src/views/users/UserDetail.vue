<template lang="pug">
	div(class="main")
		ErrorIndicator(v-if="error") Error while loading user details!
		div(v-else)
			Loading(v-if="loading")
			div(v-else)
				v-card(tile outlined class="user-card")
					v-avatar(size="100" class="user-avatar")
						template(v-if="user.imagefile")
							v-img(:src="user.imagefile")
						template(v-else)
							v-icon(size="100") mdi-account-circle
					div(class="user-details")
						h1(class="display-1 font-weight-light") {{ user.username }}
							span(v-if="user.full_name" class="headline") 
								| &nbsp; | &nbsp; {{ user.full_name }}
						h4(class="body-2")
							| {{ user.username }} has created &nbsp;
							strong {{ user.appellation_count }} &nbsp;
							| appellation(s) and &nbsp;
							strong {{ user.relation_count }}&nbsp;
							| relation(s) in &nbsp;
							strong {{ user.text_count }} 
							| text(s)
						br
						div(v-if="user.affiliation" class="body-1")
							strong Affiliation:&nbsp;
							| {{ user.affiliation }}
						div(v-if="user.location" class="body-1")
							strong Location:&nbsp;
							| {{ user.location }}
						div(v-if="user.link" class="body-1")
							strong Link:&nbsp;
							a(:href="user.link" target="_blank") {{ user.link }}

				v-row
					v-col(md="6")
						v-card(tile outlined)
							v-card-title Projects
							v-card-text
								v-list(class="user-project-list")
									template(v-if="!user.projects.length")
										EmptyView No projects found!
									template(v-for="(project, index) in user.projects")
										ProjectItem(:project="project")
										v-divider(v-if="index + 1 < user.projects.length")
					v-col(md="6")
						v-card(tile outlined)
							v-card-title Recent Activity
							v-card-text
								highcharts(:options="chartOptions")

				v-card(class="card-annotations")
					v-row(class="annotation-title")
						v-col(md="6")
							v-card-title Recent Annotations
						v-col(md="6")
							div(class="float-right")
								v-btn(class="view-annotations" :to="`/relations`" dense outlined) View all
					v-card-text
						template(v-if="!user.relations.length")
							EmptyView No annotations found!
						template(v-else)
							AnnotationList(v-bind:annotations="user.relations")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import Highcharts from 'highcharts';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import ProjectItem from '@/components/project/ProjectItem.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import { User } from '@/interfaces/GlobalTypes';

@Component({
	name: 'UserDetail',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
		ProjectItem,
		AnnotationList,
	},
})
export default class UserDetail extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private user: User = {id: 1, username: ''};
	private chartOptions: Highcharts.Options = {
		chart: {
	   		type: 'column',
		},
		title: {
			text: 'Weekly annotations',
		},
		xAxis: {
			categories: [],
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Annotations',
			},
		},
		lang: {
			noData: 'No annotations data found!',
		},
		series: [],
	};

	public mounted(): void {
		this.getUser();
	}

	private async getUser(): Promise<void> {
		Vue.$axios.get(`/users/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.user = response.data;
				this.$store.commit('setUser', this.user);

				if (response.data.appellation_count > 0) {
					// Set X-axis with week labels
					const xAxis: Highcharts.AxisOptions = {
						categories: response.data.weekly_annotations.map(
							(i: { week: string }) => moment.utc(i.week).format('YYYY/MM/DD'),
						),
					};
					this.chartOptions.xAxis = xAxis as Highcharts.XAxisOptions;

					// Set data
					const data: number[] = response.data.weekly_annotations.map(
						(i: { count: number }) => i.count,
					);
					const series: Highcharts.SeriesColumnOptions[] = [{
						type: 'column',
						name: 'Annotations',
						data,
					}];
					this.chartOptions.series = series;
				}
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.user-card {
	padding: 20px;
	align-items: flex-start;
	display: flex;
	flex: 1 1 100%;
}

.user-details {
	padding: 20px;
}

.user-avatar {
	border-radius: 50px !important;
}

.user-project-list {
	height: 400px;
	max-height: 400px;
	overflow-y: auto;
}
.card-annotations {
	padding: 20px 0;
	text-align: left;
}
.annotation-title {
	padding: 16px 16px 8px;
}
.view-annotations {
	align-self: center;
}
</style>