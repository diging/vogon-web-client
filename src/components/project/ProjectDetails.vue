<template lang="pug">
    div
        h2(class="display-1") Project Details
        br
        div(v-if="error") Error while loading project detals
        div(v-else)
            div(v-if="loading" class="text-center loading")
                v-progress-circular(indeterminate :size="70" :width="7" color="teal")
            v-card(v-else tile outlined class="project-details")
                v-row
                    v-col(md="6")
                        h3(class="headline") {{ project.name }}
                        h4(class="subtitle-1") {{ project.description }}
                        span(class="overline") Created by "user" on {{moment(project.created).format('lll')}}
                    v-col(md="6")
                        div(class="float-right")
                            v-btn(tile large outlined class="ma-2")
                                v-icon(left) mdi-pencil
                                span  Edit Project
                            v-btn(tile depressed color="teal" large class="ma-2" dark)
                                v-icon(left) mdi-plus
                                span Add text

            br
            v-card
                v-card-title Texts
                v-data-table(:headers="textHeaders" :items="project.texts")
            
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import { Project, Text } from '@/models';
import { getProjectDetails } from '@/services/project';

@Component({
	name: 'Main',
})
export default class Main extends Vue {
	private project?: Project;
	private loading: boolean = true;
	private error: boolean = false;
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}];

	public async mounted(): Promise<void>  {
		try {
			const project: Project = await getProjectDetails(this.$route.params.id);
			this.project = project;
		} catch (e) {
			this.error = true;
		} finally {
			this.loading = false;
		}
	}
}
</script>

<style scoped>
.loading {
    margin-top: 70px;
}
.project-details {
    padding: 20px;
}
</style>