<template lang="pug">
v-dialog(v-model="show" persistent max-width="600px")
    template(v-slot:activator="{ on }")
        v-btn(tile color="teal" large dark v-on="on" v-bind:outlined="settings.outlined")
            v-icon(left) {{settings.icon}}
            span {{settings.action}} project
    
    v-form(lazy-validation ref="createProject" v-model="valid")
        v-card
            v-container
                v-card-title
                    span(class="headline") {{settings.action}} project
                v-card-text
                    v-text-field(label="Name*" required v-model="currentProject.name" :rules="projectNameRules")
                    v-textarea(label="Description" auto-grow v-model="currentProject.description")
                    v-text-field(label="Quadriga Id" v-model="currentProject.quadriga_id")
                    v-alert(v-if="failed" dense type="error") Error while {{settings.continuousVerb}} project!
                v-card-actions
                    div(class="flex-grow-1")
                    v-btn(large text @click="show = false") Close
                    v-btn(color="teal" dark large depressed @click="saveProject" :loading="updating") {{settings.action}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Project, Text } from './models';
import { VForm } from '@/models';
import { createOrUpdateProject } from './services';


@Component({
    name: 'CreateUpdateProject',
})
export default class CreateUpdateProject extends Vue {
    @Prop({ default: false, type: Boolean }) private readonly update: boolean | undefined;
    @Prop() private readonly project!: Project;
    @Prop({ type: Function }) private readonly onFinish!: (project: Project) => void;

    private settings = this.update ? {
        action: 'Update',
        continuousVerb: 'updating',
        icon: 'mdi-pencil',
        outlined: 'outlined',
    } : {
        action: 'Create',
        continuousVerb: 'creating',
        icon: 'mdi-plus',
        outlined: false,
    };
    private show: boolean = false; // To show dialog
    private currentProject: Project = this.project ? this.project : {
        name: '',
        description: '',
        quadriga_id: '',
        ownedBy: 1, // ToDo: Change with token
    };
    private updating: boolean = false;
    private valid: boolean = false;
    private projectNameRules = [
        (v: boolean) => !!v || 'Name is required',
    ];
    private failed: boolean = false;

    public saveProject(): void {
        if ((this.$refs.createProject as VForm).validate()) {
            this.updating = true;
            createOrUpdateProject(this.currentProject)
                .then((project: Project) => {
                    this.updating = false;
                    this.show = false;
                    this.onFinish(project);
                })
                .catch(() => this.failed = true)
                .finally(() => this.updating = false);
        }
    }
}
</script>

<style scoped>

</style>