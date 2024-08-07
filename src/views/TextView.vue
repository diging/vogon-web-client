
<template lang="pug">
div(class="text-container")
	ErrorIndicator(v-if="error") Error while loading text details!
	template(v-else)
		Loading(v-if="loading")
		div(v-else)
			SideDrawer(:text="text" :project="project")
			v-card(outlined)
				div(class="annotation-toolbar")
					ToolBar(:text="text" :relationsets="pendingRelationsets")
				v-row(no-gutters)
					v-col(
						cols="6"
						class="annotation-fixed-content pb-10"
						style="border-right: 1px solid #ccc;"
					)
						TextDisplay(:content="content" :appellations="appellations")
					v-col(
						cols="6"
						class="annotation-fixed-content"
					)
						ListsSideDrawer(
							:relations='relations'
							:appellations="appellations"
							:relationsets="relationsets"
							:network="network"
						)
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'

import AppellationList from '@/components/annotator/AppellationList.vue'
import ListsSideDrawer from '@/components/annotator/ListsSideDrawer.vue'
import NetworkGraph from '@/components/annotator/NetworkGraph.vue'
import RelationList from '@/components/annotator/RelationList.vue'
import SideDrawer from '@/components/annotator/SideDrawer.vue'
import TextDisplay from '@/components/annotator/TextDisplay.vue'
import ToolBar from '@/components/annotator/ToolBar.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import Loading from '@/components/global/Loading.vue'
import { ConceptType } from '@/interfaces/ConceptTypes'
import { Project } from '@/interfaces/ProjectTypes'
import { Appellation, Relation, RelationSet } from '@/interfaces/RelationTypes'
import { TextDocument } from '@/interfaces/RepositoryTypes'
import {v4 as uuidv4} from 'uuid'

@Component({
    name: 'TextView',
    components: {
        TextDisplay,
        ToolBar,
        SideDrawer,
        RelationList,
        AppellationList,
        ListsSideDrawer,
        NetworkGraph,
        ErrorIndicator,
        Loading,
    },
})
export default class TextView extends Vue {
    private content: string = ''
    private project: Project = { name: '', participants: [] }
    private text?: TextDocument
    private conceptTypes: ConceptType[] = []
    private appellations: Appellation[] = []
    private relations: Relation[] = []
    private relationsets: RelationSet[] = []
    private pendingRelationsets: RelationSet[] = []
    private network: any = null

    private loading: boolean = true
    private error: boolean = false
    private queryParam: string = ''

    public created() {
        this.getContent()
        this.watchStore()
    }

    private getContent() {
        const projectId = this.$route.query.project_id
        const groupId = this.$route.query.group_id
        const repoId = this.$route.query.repo_id
        const fileId = this.$route.query.file_id
        if (projectId) {
            this.queryParam = `?project_id=${projectId}&group_id=${groupId}&repo_id=${repoId}&file_id=${fileId}`
        }

        Vue.$axios.get(`/annotate/${this.$route.params.id}${this.queryParam}`)
            .then((response: AxiosResponse) => {
                this.content = response.data.content
                this.project = response.data.project
                this.text = response.data.text
                this.conceptTypes = response.data.concept_types
                this.appellations = []
                this.appellations.push(...response.data.appellations)
                this.appellations.push(...response.data.dateappellations)
                for (const i in this.appellations) {
                    this.appellations[i].index = uuidv4()
                }
                this.appellations = this.appellations
                    .filter((item: any) => item.position)
                    .map((item: any) => ({
                        ...item,
                        visible: true,
                        position: {
                            ...item.position,
                            startOffset: parseInt(item.position.position_value.split(',')[0], 10),
                            endOffset: parseInt(item.position.position_value.split(',')[1], 10),
                        },
                    }))
                this.$store.commit('setAnnotatorAppellations', this.appellations)
                this.$store.commit('setAnnotatorText', this.text)
                this.$store.commit('setAnnotatorConceptTypes', this.conceptTypes)
                this.$store.commit('setAnnotatorMeta', {
                    project: response.data.project.id,
                    occursIn: response.data.textid,
                })

                this.relations = response.data.relations
                this.pendingRelationsets = response.data.pending_relationsets
                this.relationsets = response.data.relationsets
            })
            .catch((error: AxiosError) => {
                this.error = true
                console.log(error.response)
            })
            .finally(() => this.loading = false)

        Vue.$axios.get(`/annotate/${this.$route.params.id}/network${this.queryParam}`)
            .then((response: AxiosResponse) => {
                this.network = response.data.elements
            })
    }

    private watchStore() {
        this.$store.watch(
            (state, getters) => getters.getAnnotatorCreatedAppellation,
            (newValue, oldValue) => {
                if (newValue) {
                    this.getContent()
                    this.$store.commit('setAnnotatorCreatedAppellation', false)
                }
            },
        )
        this.$store.subscribe((mutation: any, state: any) => {
            if ((mutation.type === 'setRelationCreated' ||
                 mutation.type === 'setAppellationDeleted') &&
                mutation.payload === true
            ) {
                this.getContent()
            }
        })
    }
}
</script>

<style scoped lang="scss">
.resize {
  width: 75%;
  height: auto;
}
v-container {
  margin: 0 0 0 0;
}
#vogon-banner {
  padding: 15px;
  background-color: #ddd;
  border-radius: 5px;
}
#vogon-banner h2 {
  margin-top: 10px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.text-container {
	max-width: 100%;
}
.annotation-toolbar {
	border-bottom: 1px solid #ccc;
}
.annotation-fixed-content {
	max-height: calc(100vh - 206px);
	overflow-y: auto;
}
</style>