<template lang="pug">
    div
        v-row
            v-col(md="6")
                h2(class="display-1") Projects
            v-col(md="6")
                div(class="float-right")
                    v-dialog(v-model="showCreateProject" persistent max-width="600px")
                        template(v-slot:activator="{ on }")
                            v-btn(tile color="teal" large dark v-on="on")
                                v-icon(left) mdi-plus
                                span Create project
                        
                        v-form(lazy-validation ref="createProject" v-model="createProjectValid")
                            v-card
                                v-card-title
                                    span(class="headline") Create new project
                                v-card-text
                                    v-container
                                        v-text-field(label="Name*" required v-model="newProject.name" :rules="projectNameRules")
                                        v-textarea(label="Description" auto-grow v-model="newProject.description")
                                        v-text-field(label="Quadriga Id" v-model="newProject.quadriga_id")
                                    small *indicates required field
                                    v-alert(v-if="createProjectFailed" type="error") Error while creating new project
                                v-card-actions
                                    div(class="flex-grow-1")
                                    v-btn(large text @click="showCreateProject = false") Close
                                    v-btn(color="teal" :disabled="!createProjectValid" large depressed @click="saveProject" :loading="creatingProject") Create

        
        div(v-if="error") Error while loading project list
        div(v-else)
            div(v-if="loading" class="text-center loading")
                v-progress-circular(indeterminate :size="70" :width="7" color="teal")
            v-list(v-else color="transparent")
                v-list-item(v-for="project in projects" :key="project.id" class="project-item" v-bind:href="`/project/${project.id}`")
                    v-card(width="100%" class="project-item-card")
                        v-card-title {{project.name}}
                        v-card-text Created by "user" on {{moment(project.created).format('lll')}}

        v-snackbar(v-model="showSnackbar" :color="snackbarColor" top timeout=3000) {{snackbarText}}
            v-btn(color="#fff" text @click="showSnackbar = false")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

import { getProjects, createProject } from '@/services/project';
import { VForm, Project, Text, PaginatedResult } from '@/models';

@Component({
    name: 'Main',
})
export default class Main extends Vue {
    private projects: Project[] = [];
    private loading: boolean = true;
    private error: boolean = false;

    private showCreateProject: boolean = false; // To show `Create project` modal
    private newProject: Project = {
        name: '',
        description: '',
        quadriga_id: '',
        ownedBy: 1, // ToDo: Change with token
    };
    private creatingProject: boolean = false; // To show `loading` symbol in `CREATE` button
    private createProjectValid: boolean = false; // Is `Create Project` form valid?
    private projectNameRules = [
        (v: boolean) => !!v || 'Name is required',
    ];
    private showSnackbar: boolean = false;
    private snackbarText: string = '';
    private snackbarColor: string = 'success';
    private createProjectFailed: boolean = false;

    public async mounted(): Promise<void>  {
        try {
            const projects: Project[] = await getProjects();
            this.projects = projects;
        } catch (e) {
            this.error = true;
        } finally {
            this.loading = false;
        }
    }

    public async saveProject(): Promise<void> {
        if ((this.$refs.createProject as VForm).validate()) {
            try {
                this.creatingProject = true;
                const response: Project = await createProject(this.newProject);
                this.creatingProject = false;
                this.showCreateProject = false;
                this.showSnackbar = true;
                this.snackbarText = 'Successfully created new project';
                this.snackbarColor = 'success';
            } catch (e) {
                this.createProjectFailed = true;
            } finally {
                this.creatingProject = false;
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
</style>