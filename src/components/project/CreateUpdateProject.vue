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
import { AxiosResponse } from 'axios';

import { VForm } from '@/models';
import { IProject } from './models';


@Component({
  name: 'CreateUpdateProject',
})
export default class CreateUpdateProject extends Vue {
  @Prop({ default: false, type: Boolean }) private readonly update: boolean | undefined;
  @Prop() private readonly project!: IProject;
  @Prop({ type: Function }) private readonly getProjectDetails!: (project: IProject) => void;

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
  private currentProject: IProject = this.project ? this.project : {
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
      let request: Promise<AxiosResponse>;
      if (this.currentProject.id) {
        // Update current project
        request = this.updateProject();
      } else {
        // Create new project
        request = this.createProject();
      }

      // Perform request
      request
        .then((response: AxiosResponse) => {
          this.updating = false;
          this.show = false;
          this.getProjectDetails(response.data as IProject);
        })
        .catch(() => this.failed = true)
        .finally(() => this.updating = false);
    }
  }

  private updateProject(): Promise<AxiosResponse> {
    return Vue.$axios.put(`/project/${this.currentProject.id}`, {
      name: this.currentProject.name,
      description: this.currentProject.description,
      quadriga_id: this.currentProject.quadriga_id,
      ownedBy: this.currentProject.ownedBy,
    });
  }

  private createProject(): Promise<AxiosResponse> {
    return Vue.$axios.post('/project', this.currentProject);
  }
}
</script>

<style scoped>

</style>