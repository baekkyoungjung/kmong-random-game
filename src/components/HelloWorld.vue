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
							<input v-model.number='options.groupCounts' type="number" class="form-control">
						</div>
						<div class="col-xs-4 col-sm-3">
							<div class="form-group">
								<p>에외자 리스트: {{ options.exeptionMembers }}</p>
								<input
									class="form-control"
									placeholder="예외자"
									ref="exeptionMembers"
								>
								<button
									@click='addLists("exeptionMembers")'
									type="submit"
									class="btn btn-primary"
								>
									Submit
								</button>
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
								<button
									@click='addLists("mustInclude")'
									type="submit"
									class="btn btn-primary"
								>
									<div>Submit</div>
								</button>
							</div>
						</div>
					</div>
					<div id="start-matching">
						<button type="button" class="btn btn-lg btn-default" @click="gogogo">gogogo</button>
					</div>
				</div>
			</div>
		</div>
		<div class="wrapper">
			<div id="form-result">
				<div class="row">
					<div
						class="col-xs-3 group-wrapper"
						v-for="group in resultArr"
					>
						<div
							v-for="human in group"
							class="team col-xs-12"
							
						>
							<div class="group-item">
								<!-- <div :class="human.team">{{ human.team }}</div> -->
								<div :class="human.gender">{{ human.nickname }}</div>
							</div>
						</div>
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
			remainMembers: kmongMembers,
			resultArr: [],
			genderRatio: kmongUtils.getRatio('f', 'ratio'),
			options: {
				exeptionMembers: [],
				maximumMembers: kmongUtils.kmongMembersLength(),
				groupLimit: 1,
				groupCounts: 1,
				mustInclude: [],
				considerTeam: false,
				considerGender: false,
				considerPreviousResults: false,
			},
			nowGender: 'f',
		}
	},
	mounted() {
	},
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
			this.options.exeptionMembers.map(exeption => {
				this.setLeftRemainMembers(exeption);
			})
			this.resultArr = this.setGroupCountArr();

			this.resultArr.map((group, i) => {
				this.loopForPeople(group);
				this.resultArr[i] = _.shuffle(group);
			});

		},
		loopForPeople(group) {

			let i = group.length;
			for (i; i < this.options.groupLimit; i += 1) {
				const sortGenderLists = kmongUtils.getRatio(this.nowGender);
				// 성별을 일단 추출
				// 성별중 한명을 추출 
				const candidate = this.getOneHumanShuffle(sortGenderLists);
				// 첫빠따면 아무 조건없이 한명 넣기 (일단은)
				if (group.length === 0) {
					group = this.nextPeople(group, candidate);
				} else {
					// 진짜 로직 시작
					// 이전 데이타를 고려해서 너어볼까?
					this.calculateLatestData(group);
					group = this.nextPeople(group, candidate);
				}
			}
		},
		calculateLatestData(group) {
		},
		nextPeople(group, candidate) {
			group.push(candidate);
			this.setSelectGenderRatio();
			return group;
		},
		setSelectGenderRatio() {
			// const genderRatio = this.genderRatio / 100;
			// const randomValue = Math.random();
			// random이 여자 비율보다 낮으면 ? 
			// this.nowGender = (randomValue < genderRatio) ? 'f' : 'm';
			this.nowGender = this.nowGender === 'm' ? 'f' : 'm';
		},
		setGroupCountArr() {
			let i = this.options.groupCounts;
			this.options.groupLimit = Math.round(this.remainMembers.length / i);
			const newResultArr = [];
			for (i; i > 0; i -= 1) {
				newResultArr.push([]);
			}
			return newResultArr;
		},
		getOneHumanShuffle(candidateList) {
			const selectOne = _.sample(candidateList);
			// this.options.exeptionMembers
			// ran, bk
			// 다시 remainMembers에 넣는 작업
			return selectOne;
		},
		setLeftRemainMembers(theOne) {
			this.remainMembers = _.remove(this.remainMembers, human => human.nickname !== theOne );
		}
	}

}
</script>

<style>
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
#form-result {
	margin: 0 auto;
}
.group-wrapper {
	margin-bottom: 30px;
}
.group-item {
	/*border: 1px solid black;*/
}
.team {
	font-size: 18px;
	font-weight: bold;
}
.team .f {
	color: pink;
}
.team .m {
	color: skyblue;
}
.dev {
	color: green;
}
.operation {
	color: pink;
}
.c {
	color: black;
}
.marketing {
	color: yellow;
}
.management {
	color: brown;
}
</style>
