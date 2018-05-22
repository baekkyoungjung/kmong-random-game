<template>
	<div class="container hello">
		크몽랜덤
		<div class="form-group">
			<label for="input" class="control-label">:</label>
			<div>
				<select
					class="form-control"
					v-model="selectedType"
				>
					<option v-for="type in typeLists" v-bind:value="type">
						{{ type }}
					</option>
				</select>
				<div v-if="selectedType !== ''">
					<div class="row">
						<div class="col-xs-4 col-sm-3">
							<input id="consider-team" class="form-control" type="checkbox" v-model="options.considerTeam">
							<label for="consider-team">팀 고려</label>
						</div>
						<div class="col-xs-4 col-sm-3">
							<input id="consider-gender" class="form-control" type="checkbox" v-model="options.considerGender">
							<label for="consider-gender">성별 고려</label>
						</div>
						<div class="col-xs-4 col-sm-3">
							<input id="consider-previous-results" class="form-control" type="checkbox" v-model="options.considerPreviousResults">
							<label for="consider-previous-results">이전결과 고려</label>
						</div>
						<div class="col-xs-4 col-sm-3">
							<div>최대 인원</div>
							<input v-model.number="options.maximumMembers" type="number" class="form-control">
						</div>
						<!-- <div class="col-xs-4 col-sm-3">
							<div>그룹당 최대 인원</div>
							<input v-model.number="options.groupLimit" type="number" class="form-control">
						</div> -->
						<div class="col-xs-4 col-sm-3">
							<div>최대 그룹 갯수</div>
							<input v-model.number="options.groupCounts" type="number" class="form-control">
						</div>
						<div class="col-xs-4 col-sm-3">
							<div class="form-group">
								<p>에외자 리스트: {{ options.exeptionMembers }}</p>
								<input
									class="form-control"
									placeholder="예외자"
									ref="exeptionMembers"
								>
								<button @click="addLists('exeptionMembers')" type="submit" class="btn btn-primary">Submit</button>
							</div>
						</div>
						<div class="col-xs-4 col-sm-3">
							<div class="form-group">
								<p>필수자 리스트: {{ options.mustInclude }}</p>
								<input
									class="form-control"
									placeholder="필수자"
									ref="mustInclude"
								>
								<button @click="addLists('mustInclude')" type="submit" class="btn btn-primary">Submit</button>
							</div>
						</div>
					</div>
					<div id="start-matching">
						<button type="button" class="btn btn-lg btn-default" @click="gogogo">gogogo</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash';
import { kmongMembers, kmongTeams, previousResults } from '../importData';
import kmongUtils from '../kmongUtils';
console.log('kmongMembers', kmongMembers);

export default {
	name: 'HelloWorld',
	data () {
		return {
			selectedType: '',
			typeLists: ['friendly', 'cleaning', 'monthlyDining'],
			remainMembers: Object.keys(kmongMembers),
			resultArr: [],
			genderRatio: kmongUtils.getRatio(),
			options: {
				exeptionMembers: [],
				maximumMembers: kmongUtils.kmongMembersLength(),
				// groupLimit: 0,
				groupCounts: 1,
				mustInclude: [],
				considerTeam: false,
				considerGender: false,
				considerPreviousResults: false,
			}
		}
	},
	mounted() {},
	methods: {
		addLists(type) {
			if (typeof this.$refs[type] === 'undefined'
				|| this.$refs[type].value === ''
				|| this.options[type].includes(this.$refs[type].value) === true
			) {
				alert('뭔가 이상하다.');
				this.$refs[type].value = '';
				return false;
			}
			this.options[type].push(this.$refs[type].value);
			this.$refs[type].value = '';
		},
		gogogo() {
			console.log('previousResults[this.selectedType]', previousResults[this.selectedType]);
			if (this.options.considerPreviousResults && previousResults[this.selectedType].length === 0) {
				alert('비교할 데이터가 없읍니다.');
			}
			this.resultArr = setGroupCountArr();
		},
		setGroupCountArr() {
			let i = this.options.groupCounts;
			const newResultArr = [];
			for (i; i > 0; i -= 1) {
				newResultArr.push([]);
			}
			return newResultArr;
		},
		getOneHumanShuffle() {
			const selectOne = _.sample(this.remainMembers);
			// 다시 remainMembers에 넣는 작업
			this.remainMembers = _.remove(this.remainMembers, function(human) {
				return human !== selectOne;
			});
			return selectOne;
		}
	}

}
</script>

<style scoped>
h1, h2 {
	font-weight: normal;
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
</style>
