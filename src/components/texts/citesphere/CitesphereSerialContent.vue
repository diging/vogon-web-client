<template lang="pug">
v-card(tile outlined class="container")
	ErrorIndicator(v-if="error") {{ errorMsg }}
	div(v-else)
		div(class="text-details")
			h3(class="headline") Serial Content
			| The following content are serialized parts of this resource, such as individuated pages. Multiple content types may be available.
		template(v-if="!contents.length")
			EmptyView No contents found!
		v-list(v-else two-line)
			template(v-for="content ,index in results")
				v-list-item(:key="content[0]['value']['id']")
					v-list-item-content
						v-list-item-title(class="font-weight-medium" v-text="index")
						v-list-item-title(class="font-weight-medium" v-text="content[0]['value']['content-type']")
						div
							template(v-for="(item,i) in content")
								v-btn(
									:disabled="!ready || !editable"
									class="ma-2" color="primary" fab :key="i" x-small elevation=0 
									:to="`/repository/citesphere/${$route.params.repoId}/groups/${$route.params.groupId}/items/${$route.params.itemId}/file/${item['value']['id']}${queryParam}`"

								) {{ i+1 }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import EmptyView from '@/components/global/EmptyView.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import { TokenDto } from '@/interfaces/GlobalTypes'
import JwtDecode from 'jwt-decode'

@Component({
    name: 'CitesphereSerialContent',
    components: {
        EmptyView,
        ErrorIndicator,
    },
})
export default class CitesphereSerialContent extends Vue {
    @Prop() private readonly contents!: any
    @Prop() private readonly ready!: boolean
    @Prop() private readonly editable!: boolean
    @Prop() private readonly data!: boolean
    private queryParam = ''
    private reconstructedData: any = []
    private results: any = ''
    private error: boolean = false
    private errorMsg: string = ''

    public created() {
        const token: any = localStorage.getItem('token')
        const decoded = JwtDecode<TokenDto>(token)
        if (!decoded.citesphere_token) {
            this.error = true
            this.errorMsg = 'Please Obtain Citesphere Authorization'
        }
        for (const content in this.contents) {
            this.reconstructedData.push({key: 'image', value: this.contents[content].image})
            this.reconstructedData.push({key: 'text', value: this.contents[content].text})
            this.reconstructedData.push({key: 'ocr', value: this.contents[content].ocr})
        }
        this.results = this.reconstructedData.reduce((r: any, a: any) => { r[a.key] = [...r[a.key] || [], a]; return r; }, {})
        const projectId = this.$route.query.project_id
        if (projectId) {
            this.queryParam = `?project_id=${projectId}`
        }
    }
}
</script>

<style scoped>
.container {
	margin-bottom: 20px;
}
.text-details {
	padding: 10px;
	margin-bottom: 0;
}
</style>