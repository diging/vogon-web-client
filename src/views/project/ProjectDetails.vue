<template lang="pug">
div(class="main")
	h2(class="display-1") Project Details
	br
	ErrorIndicator(v-if="error") Error while loading project details!
	div(v-else)
		Loading(v-if="loading")
		template(v-else)
			Breadcrumbs(:items="navItems")
			v-card(tile outlined class="project-details")
				v-row
					v-col(md="6")
						div(class="d-flex justify-start")
							h3(class="headline") {{ project.name }}
							v-tooltip(
								v-if="isOwner && !project.is_default"
								top
							)
								template(v-slot:activator="{ on, attrs }")
									v-icon(
										v-bind="attrs"
										v-on="on"
										class="ml-2"
										@click="setAsDefaultDialog = true"
									) mdi-star-outline
								span Set this as your default project
					
							v-tooltip(
								v-if="project.is_default"
								top
							)
								template(v-slot:activator="{ on, attrs }")
									v-icon(
										v-bind="attrs"
										v-on="on"
										class="ml-2"
									) mdi-star
								span This is your default project
						h4(class="subtitle-1") {{ project.description }}
						span(class="body-2 blue-grey--text text--darken-1") Owned by 
							strong "{{ project.ownedBy.username }}",
							| &nbsp;created on 
							| &nbsp;{{moment(project.created).format('lll')}} by 
							strong "{{ project.createdBy.username }}"
						div(class="body-2 mt-2")
							v-list
								v-list-item(v-for="text in project.texts")
					v-col(md="6")
						div(class="float-right" v-if="isEditable")
							CreateUpdateProject(
								v-if="isOwner"
								update
								:project="Object.assign({}, project)"
								:getProjectDetails="getProjectDetails"
							)
							v-btn(tile depressed color="teal" class="ma-2" dark :to="`/repository?project_id=${this.$route.params.id}`")
								v-icon(left) mdi-plus
								span Add text

				div(class="d-flex mt-4")
					v-btn(small outlined @click="exportAffiliations" class="mr-2") 
						| Export affiliation relations

					v-dialog(v-if="isOwner" v-model="changeOwnerDialog" scrollable max-width="500px")
						template(v-slot:activator="{ on }")
							v-btn(small v-on="on" color="error" depressed)
								v-icon(left) mdi-account-switch
								span Transfer Ownership

						UserSearch(
							:choosingUser="changingOwner"
							:onUserChoose="changeOwner"
							:onClose="() => { changeOwnerDialog = false }"
							okText="Transfer Ownership"
							cancelText="Cancel"
						)
				
				ProjectCollaborators(
					:project="project"
					:isOwner="isOwner"
					:onAdd="getProjectDetails"
				)
			br
			v-card(class="card-project-text")
				v-card-title Texts
				template(v-if="!project.texts.length")
					EmptyView No texts found! Perhaps, add one?
				template(v-else)
					v-data-table(:headers="textHeaders" :items="project.texts")
						template(v-slot:item.title="{ item }")
							router-link(:to="`/repository/citesphere/${item.repository_id}/groups/${item.group_id}/items/${item.file_id}/texts/${item.id}?project_id=${project.id}`") {{ item.title }}
			br
			v-card(class="card-project-exportappellations")
				v-card-title Export Apellations
				template(v-if="!project.texts.length")
					EmptyView No texts found! Perhaps, add one?
				template(v-else)
					v-data-table(
						:headers="textHeaders"
						:items="project.texts"
						v-model="selected"
						item-key="id"
						show-select
						)
					v-btn(tile depressed color="teal" @click="exportApellations" class="ma-3" dark)
						span Export Apellations

			br
			v-card(class="card-project-downloadcsv")
				v-card-title Download csv
				template(v-if="!csvFiles.length")
					EmptyView No Files found! Perhaps, export texts?
				template(v-else)
					v-data-table(
						:headers="fileHeaders"
						:items="csvFiles"
						item-key="id"
						)
						template(v-slot:item.created="{ item }")
							span {{ new Date(item.created).toISOString() }}
						template(v-slot:item.action="{ item }")
							v-icon(color="teal" small @click="downloadFile(item.id)") mdi-download
					
	v-snackbar(v-model="snackbar" top :color="snackColor" :timeout="3000") {{ snackbarMsg }}

	v-dialog(
		v-model="setAsDefaultDialog"
		width="500"
		:persistent="settingAsDefault"
	)
		v-card(class="pa-2")
			v-card-title(class="headline") Set as default project
			v-card-text(class="text-left") Are you sure you want to set this project as default?
			v-card-actions
				v-spacer
				v-btn(
					text
					color="green darken-1"
					@click="setAsDefaultDialog = false"
					:disabled="settingAsDefault"
				) Cancel
				v-btn(
					text 
					color="red darken-1" 
					@click="setAsDefault()"
					:disabled="settingAsDefault"
					:loading="settingAsDefault"
				) Yes
			
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'

import Breadcrumbs from '@/components/global/Breadcrumbs.vue'
import EmptyView from '@/components/global/EmptyView.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import Loading from '@/components/global/Loading.vue'
import UserSearch from '@/components/global/UserSearch.vue'
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue'
import ProjectCollaborators from '@/components/project/ProjectCollaborators.vue'
import { User } from '@/interfaces/GlobalTypes'
import { Project } from '@/interfaces/ProjectTypes'

@Component({
	name: 'ProjectDetails',
	components: {
		Breadcrumbs,
		CreateUpdateProject,
		ProjectCollaborators,
		EmptyView,
		ErrorIndicator,
		Loading,
		UserSearch,
	},
})
export default class ProjectDetails extends Vue {
	private project: Project = { name: '', participants: [], texts: []}
	private loading: boolean = true
	private error: boolean = false
	private exporting: boolean = false
	private exportError: boolean = false
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}]
	private fileHeaders = [{text: 'Id', value: 'id'},{text: 'Created', value: 'created'}, {text: 'Filedownload', value: 'file_field'}, {text: 'Action', value: 'action'}]
	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
	];

	private changeOwnerDialog: boolean = false
	private changingOwner: boolean = false
	private snackbar: boolean = false
	private snackbarMsg: string = ''
	private snackColor: string = 'success'
	private errorMsg: string = ''
	private texts: any = {}
	private selected: any = []
	private enableCSVDownload : boolean = false
	private csvFiles : any = {}

	private setAsDefaultDialog: boolean = false
	private settingAsDefault: boolean = false

	public async mounted(): Promise<void> {
		this.getProjectDetails()
		this.getCSVFiles()
	}

	get isEditable(): boolean {
		return Vue.$utils.permissions.isProjectCollaborator(this.project)
	}

	get isOwner(): boolean {
		return Vue.$utils.permissions.isProjectOwner(this.project)
	}

	private getProjectDetails() {
		this.loading = true
		return Vue.$axios.get(`/project/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.project = response.data as Project
				this.navItems[1].text = this.project.name
				this.navItems[1].to = `/project/${this.project.id}`
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false)
	}

	private exportApellations() {
		let text_ids = []
		for(const select of this.selected) {
			text_ids.push(select.id)
		}
		const payload = {"texts": text_ids}
		Vue.$axios.post('export/', payload)
			.then((response: AxiosResponse) => {
				this.enableCSVDownload = true
				this.getCSVFiles()
			})
			.catch((error: AxiosError) => {
				this.error = true
				if (error.response && error.response.data && error.response.data.detail) {
					this.errorMsg = error.response.data.detail
				} else {
					this.errorMsg = error.message
				}
			})
	}

	private getCSVFiles() {
		Vue.$axios.get(`/download/`)
			.then((response: AxiosResponse) => {
				this.csvFiles = response.data
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false)

	}

	private downloadFile(file: any) {
		Vue.$axios.get(`/download/previous/${file}/`)
			.then((response: AxiosResponse) => {
				const blob = new Blob([response.data], { type: 'text/csv' })
				const link = document.createElement('a')
				link.href = URL.createObjectURL(blob)
				link.download = file 
				link.click()
				URL.revokeObjectURL(link.href)
			})
			.catch(() => this.exportError = true)
			.finally(() => this.exporting = false)
  	}
	
	private changeOwner(targetUser: User) {
		this.changingOwner = true
		Vue.$axios.post(`/project/${this.project.id}/change_ownership`, {
			target_user_id: targetUser.id,
		})
			.then((response: AxiosResponse) => {
				this.snackbarMsg = response.data.message
				this.snackColor = 'success'
				this.snackbar = true
				this.getProjectDetails()
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message
				} else {
					this.snackbarMsg = error.message
				}
				this.snackColor = 'error'
				this.snackbar = true
			})
			.finally(() => {
				this.changingOwner = false
			})
	}

	private setAsDefault() {
		this.settingAsDefault = true;
		this.$axios.post(`/project/${this.project.id}/set_as_default`)
			.then((response: AxiosResponse) => {
				this.snackbarMsg = response.data.message
				this.snackColor = 'success'
				this.snackbar = true
				this.getProjectDetails()
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data && error.response.data.message) {
					this.snackbarMsg = error.response.data.message
				} else {
					this.snackbarMsg = error.message
				}
				this.snackColor = 'error'
				this.snackbar = true
			})
			.finally(() => {
				this.settingAsDefault = false
				this.setAsDefaultDialog = false
			})
	}

	private exportAffiliations() {
		this.exporting = true
		Vue.$axios.get(`/project/${this.$route.params.id}/export_affiliations`,
			{ responseType: 'blob' },
		)
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', 'affiliations_export.csv')
				document.body.appendChild(link)
				link.click()
			})
			.catch(() => this.exportError = true)
			.finally(() => this.exporting = false)
	}
}
</script>

<style scoped>
.project-details {
	padding: 20px;
}
.card-project-text {
	padding: 20px 0;
}
</style>