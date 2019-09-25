<template lang="pug">
    div
        v-row
            v-col(md="6")
                h2(class="display-1") Projects
            v-col(md="6")
                div(class="float-right")
                    CreateUpdateProject(v-bind:onFinish="onFinish")
        ErrorIndicator(v-if="error") Error while loading projects!
        div(v-else)
            Loading(v-if="loading")
            v-list(v-else color="transparent")
                template(v-if="!projects.length")
                    br
                    div(class="text-center")
                        v-icon(x-large) mdi-folder
                        br
                        div No projects found!
                template(v-else)
                    v-list-item(v-for="project in projects" :key="project.id" class="project-item" v-bind:href="`/project/${project.id}`")
                        v-card(width="100%" class="project-item-card" elevat)
                            v-card-title {{project.name}}
                            v-card-text
                                div(class="text--primary") {{project.description}}
                                | Created by 
                                strong "user"
                                | on {{moment(project.created).format('lll')}}
                                div(class="teal--text") 
                                    strong {{project.texts.length}} texts, 0 relations

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

import CreateUpdateProject from './CreateUpdateProject.vue';
import Loading from '@/components/global/Loading.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import { getProjects } from './services';
import { Project, Text } from './models';
import { VForm } from '@/models';
import { RawLocation } from 'vue-router';

@Component({
    name: 'ProjectList',
    components: {
        Loading,
        ErrorIndicator,
        CreateUpdateProject,
    },
})
export default class ProjectList extends Vue {
    private projects: Project[] = [];
    private loading: boolean = true;
    private error: boolean = false;

    public mounted(): void {
        this.getProjectList();
    }

    private getProjectList() {
        getProjects()
            .then((projects: Project[]) => this.projects = projects)
            .catch(() => this.error = true)
            .finally(() => this.loading = false);
    }

    private onFinish(project: Project) {
        // @ts-ignore
        this.$router.push({ name: 'project-details', params: { id: project.id }});
    }
}
</script>

<style scoped>
.project-item {
    padding: 0;
    margin: 10px 0;
}
</style>