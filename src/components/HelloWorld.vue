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

// 
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
			if (this.options.considerPreviousResults && previousResults[this.selectedType].length === 0) {
				alert('비교할 데이터가 없읍니다.');
			}
			this.resultArr = this.setGroupCountArr();
			// 한그룹씩 쌓아나가기
			// 1. 이전데이터 참고
			// 2. 성별
			// 3. 팀별
			// flow - 랜덤으로 뽑힌 한 사람을 이전데이터에서 돌린뒤, 항아리에 이미 있는 사람을 고려해서 (혹은 더 이전 데이터 참고) 진행할지 말지 결정
			// - 진행된다면 성별로 
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
			// this.options.exeptionMembers
			// ran, bk
			// 다시 remainMembers에 넣는 작업
			this.remainMembers = _.remove(this.remainMembers, human => human !== selectOne );

			if (this.considerGender) {
				// 여성 기준 56%
				// 첫번째가 남자일경우에는 여자가 나올확률이 56%가 되도록 뽑는다.
			}
			
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
