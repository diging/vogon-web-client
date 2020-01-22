<template lang="pug">
	li(v-bind:class=`{
				'list-group-item': true,
				'appellation-list-item': true,
				'appellation-selected': isSelected()
			}`)
		span.pull-right.text-muted.btn-group
			a.btn.btn-xs(v-on:click="select")
				span.glyphicon.glyphicon-hand-down
			a.btn.btn-xs(v-on:click="toggle")
				span(v-if="appellation.visible" class="glyphicon glyphicon glyphicon-eye-open")
				span(v-else class="glyphicon glyphicon glyphicon-eye-close")
		p {{ label() }}
		div.text-warning
			input(v-if="sidebar === 'submitAllAppellations'" type="checkbox" v-model="checked" aria-label="...")
			p 
				| Created by <strong>{{ getCreatorName(appellation.createdBy) }}</strong> on {{ getFormattedDate(appellation.created) }}
</template>

<script lang="ts">
import { TokenDto, VForm } from '@/interfaces/GlobalTypes';
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'AppellationListItem',
})
export default class AppellationListItem extends Vue {
  @Prop()
  private appellation!: any;
  // FIXME: find and assign types for both of these
  @Prop()
  private sidebar!: any;
  @Prop()
  private index!: any;

  private checked: boolean = true;
  private canUncheckAll: boolean = false;
  private canCheckAll: boolean = false;

  public mounted() {
	this.watchUncheckStore();
	this.watchCheckStore();
	this.$root.$on('appellationClicked', (data: any) => {
		if (data === this.appellation) {
		this.checked = !this.checked;
		}
	});
  }
  @Watch('checked')
  public checkedChanged() {
	if (this.checked === false) {
		this.$store.commit('removeAppellation', this.index);
		this.$store.commit('setSelectFalse');
	} else {
		if (this.$store.getters.getValidator === 3) {
		this.$store.commit('setValidator', 0);
		}
		this.$store.commit('addAppellation', this.appellation);
		this.$store.commit('setDeselectFalse');
	}
  }
  private watchUncheckStore() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.getDeselect;
		},
		(val) => {
		if (val) {
			this.uncheckAll();
			this.canCheckAll = true;
		}
		},
	);
  }
  private watchCheckStore() {
	this.$store.watch(
		(state) => {
		return this.$store.getters.getSelect;
		},
		(val) => {
		if (val) {
			this.checkAll();
		}
		},
	);
  }

  private uncheckAll() {
	this.checked = false;
  }

  private checkAll() {
	this.checked = true;
  }

  private hide() {
	// TODO: Get rid of emit
	this.$emit('hideappellation', this.appellation);
  }

  private show() {
	// TODO: Get rid of emit
	this.$emit('showappellation', this.appellation);
  }
  private toggle() {
	if (this.appellation.visible) {
		this.hide();
	} else {
		this.show();
	}
  }

  private isSelected() {
	return this.appellation.selected;
  }

  private select() {
	// TODO: Get rid of emit
	this.$emit('selectappellation', this.appellation);
  }

  private label() {
	if (this.appellation.interpretation) {
		return this.appellation.interpretation.label;
	} else if (this.appellation.dateRepresentation) {
		return this.appellation.dateRepresentation;
	}
  }
  private getCreatorName(creator: any) {
	const decoded = JwtDecode<TokenDto>(localStorage.getItem('token') || '');
	if (creator.id === decoded.user_id) {
		return 'you';
	} else {
		return creator.username;
	}
  }

  private getFormattedDate(isodate: string) {
	return moment(isodate).format('dddd LL [at] LT');
  }
}
</script>

<style scoped>
.project-item {
  padding: 0;
  margin: 10px 0;
}
#title {
  background: grey;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid#ccc;
  border-radius: 4px;
  display: block;
}
#test {
  float: left;
}
#text-content {
  padding: 3%;
}
</style>