<template lang="pug">
v-list(two-line)
	ErrorIndicator(v-if="error") {{ errorMsg }}
	div(v-else)
		div
			template(v-for="(group, index) in groups")
				div(v-if="(index >= perPage*(page - 1)) && (index <= (perPage*page) - 1)")
					v-list-item(:key="group.id" v-bind:to="`/repository/citesphere/${repoId}/groups/${group.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(v-text="group.name")
							v-list-item-subtitle(class="text--primary" v-text="group.description")
						v-list-item-action
							v-list-item-action-text
								v-badge
									template(v-slot:badge) {{group.size}}
					v-divider(v-if="index + 1 < groups.length" :key="index")
			v-row
				v-spacer(cols="1")
				v-col(class="pagination" cols="1" offset="4" offset-xl="3")
					v-pagination(v-model="page" :length="Math.max(this.groups.length/this.perPage, 1)")
				v-spacer(cols="1")
				v-col(cols="2")
					p(class='rows-per-page')
						| Rows per page:
				v-col(cols="2" xl="1" class="row-select")
					v-select(:items="items" solo label="Rows" v-model="perPage" )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import { CitesphereGroup } from '@/interfaces/CitesphereTypes'
import { TokenDto } from '@/interfaces/GlobalTypes'
import JwtDecode from 'jwt-decode'

@Component({
    name: 'RepoGroups',
    components: {
        ErrorIndicator,
    },
})
export default class RepoGroups extends Vue {
    @Prop() private readonly groups!: CitesphereGroup[]
    @Prop() private readonly repoId!: string
    @Prop() private readonly queryParam!: string

    private page: number = 1
    private items: number[] = [5, 10, 15]
    private perPage: number = 5
    private error: boolean = false
    private errorMsg: string = ''

    public created() {
        const token: any = localStorage.getItem('token')
        const decoded = JwtDecode<TokenDto>(token)
        if (!decoded.citesphere_token) {
            this.error = true
            this.errorMsg = 'Please Obtain Citesphere Authorization'
        }
    }
}
</script>

<style scoped>
.row-select {
	padding-right: 31px;
}
.rows-per-page {
	font-size: 19px;
	padding-top: 8px;
}
</style>