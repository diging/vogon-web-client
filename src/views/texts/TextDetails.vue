<template lang="pug">
	div(class="main")
		br
		ErrorIndicator(v-if="error") Error while loading text details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="text-details")
					h3(class="headline") Resource "{{ text.title }}"
					v-list-item-subtitle(class="text--primary" v-text="text.uri")
				p(class="body-1")
					| The following content objects are associated with this resource. 
					| Select a content object to begin annotating that object in VogonWeb. 
				TextSerialContent(v-bind:contents="text.aggregate_content")
				TextAdditionalContent(v-bind:contents="text.content")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TextAdditionalContent from '@/components/texts/TextAdditionalContent.vue';
import TextSerialContent from '@/components/texts/TextSerialContent.vue';
import { TextResource } from '@/models';

@Component({
	name: 'TextDetails',
	components: {
		Loading,
		ErrorIndicator,
		TextSerialContent,
		TextAdditionalContent,
	},
})
export default class TextDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private text: TextResource = {id: 1, title: ''} ;

	public async mounted(): Promise<void> {
		Vue.$axios.get(`/repository/${this.$route.params.repoId}/texts/${this.$route.params.textId}`)
			.then((response: AxiosResponse) => {
				this.text = response.data.result as TextResource;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.text-details {
	padding: 20px;
	margin-bottom: 20px;
}
</style>