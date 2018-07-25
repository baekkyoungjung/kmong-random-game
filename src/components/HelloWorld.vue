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
						<!-- <div class="col-xs-4 col-sm-3">
							<div>최대 인원</div>
							<input v-model.number="options.maximumMembers" type="number" class="form-control">
						</div> -->
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
						v-for="(group, i) in resultArr"
					>
					<!-- <Draggable v-model="resultArr">
					    <transition-group> -->
					        <!-- <div
					        	class="col-xs-3 group-wrapper"
					        	v-for="(group, i) in resultArr" :key="i"
					        > -->
					        	<h2><b>{{ i + 1 }}조</b></h2>
					        	<draggable v-model="resultArr[i]">
					        	    <transition-group>
					        	        <div
					        	        	class="team col-xs-12"
					        	        	v-for="(human, ii) in group" :key="ii"
					        	        >
											<div class="group-item">
												<!-- <div :class="human.team">{{ human.team }}</div> -->
												<div :class="human.gender">{{ human.nickname }}</div>
											</div>
					        	            
					        	        </div>
					        	    </transition-group>
					        	</draggable>
					        	<!-- <div>비율 {{ resultArrRatio[i] * 100 }} / {{ (1 - resultArrRatio[i]) * 100 }}</div> -->
					        	<div>비율 {{ displayRatio(i) }}</div>
					        <!-- </div> -->
					    <!-- </transition-group>
					</Draggable> -->
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
import Draggable from 'vuedraggable'
//
const kmongUtilss = kmongUtils;
export default {
	name: 'HelloWorld',
	components: {
		Draggable,
	},
	data () {
		return {
			selectedType: '',
			typeLists: ['friendly', 'cleaning', 'monthlyDining'],
			remainMembers: [],
			resultArr: [],
			resultArrRatio: [],
			resultArrGenderSample: [],
			genderRatio: 0,
			genderDecimal: 0,
			options: {
				exeptionMembers: [],
				// maximumMembers: kmongUtils.kmongMembersLength(),
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
		displayRatio(i) {
			return `${Math.round(this.resultArrRatio[i].ratio * 100)} / ${Math.round((1 - this.resultArrRatio[i].ratio) * 100)}`;
		},
		addLists(type) {
			if (typeof this.$refs[type] === 'undefined'
				|| this.$refs[type].value === ''
				|| this.options[type].includes(this.$refs[type].value) === true
			) {
				alert('뭔가 이상하다.');
				this.$refs[type].value = '';
				return false;
			}
			console.log('this.$refs[type].value', this.$refs[type].value);
			if (this.$refs[type].value.indexOf(',') > -1) {
				console.log("this.$refs[type].value.indexOf('@')", this.$refs[type].value.indexOf('@'), this.$refs[type].value.split('@'));
				this.$refs[type].value.split(',').map(nickname => {
					if (nickname !== '') {
						this.options[type].push(nickname.replace('@', '').toLowerCase().trim());
					}
				});
			} else {
				this.options[type].push(this.$refs[type].value.toLowerCase());
			}
			

			this.$refs[type].value = '';
		},
		gogogo() {
			if (this.options.considerPreviousResults && previousResults[this.selectedType].length === 0) {
				alert('비교할 데이터가 없읍니다.');
			}
			this.remainMembers = JSON.parse(JSON.stringify(kmongMembers));

			this.resultArr = [];
			this.options.exeptionMembers.map(exeption => {
				this.setLeftRemainMembers(exeption);
			})
			this.genderRatio = kmongUtils.getRatio('f', 'ratio', this.remainMembers);
			this.genderDecimal = 0.1;
			this.resultArr = this.setGroupCountArr();
			this.resultArr.map((group, i) => {
				this.loopForPeople(group, i);
				// this.resultArr[i] = _.shuffle(group);
			});
			this.calculateGenderRatio();
			
			let sortByImBalance = JSON.parse(JSON.stringify(this.resultArrRatio));
			sortByImBalance.sort((a, b) => b.ratio - a.ratio);
			// 나머지 사람
			if (this.remainMembers.length > 0) {
				let ii = 0;
				let lastIndex = 0;
				this.remainMembers.map(human => {
					if (this.resultArr.length - 1 < ii) {
						ii = 0;
					}
					let correctSort = (human.gender === 'm') ? ii : (this.resultArrRatio.length - 1) - lastIndex;
					correctSort = correctSort < 0 ? 0 : correctSort;
					let correctIndex = sortByImBalance[correctSort].index;
					this.resultArr[correctIndex].push(human);
					ii += 1;
					if (human.gender === 'f') {
						lastIndex += 1;
					}
				});
			}
			// gender ratio 재계산
			this.calculateGenderRatio();
			this.remainMembers = [];


		},
		loopForPeople(group, index) {
			let i = group.length;
			for (i; i < this.options.groupLimit; i += 1) {
				const sortGenderLists = kmongUtils.getRatio(this.nowGender, false, this.remainMembers);
				// 성별을 일단 추출
				// 성별중 한명을 추출 
				const candidate = this.getOneHumanShuffle(sortGenderLists);
				if (candidate === false) {
					return false;
				}
				// 첫빠따면 아무 조건없이 한명 넣기 (일단은)
				if (group.length === 0) {
					group = this.nextPeople(group, candidate);
				} else {
					// 진짜 로직 시작
					// 이전 데이타를 고려해서 너어볼까?
					this.calculateLatestData(group);
					this.calculateTeam(group);
					group = this.nextPeople(group, candidate);
				}
			}

		},
		calculateLatestData(group) {
			// 현재 group에 누가있는지 파악하고, 이전데이타랑 비교해본다.
		},
		calculateTeam(group) {
			// group에 team이 절절한 비율로 있는지 확인하고 넣는다.
			// 아니면? 후보자들중에 다시 뽑아서 진행한다.
		},
		nextPeople(group, candidate) {
			group.push(candidate);
			this.setLeftRemainMembers(candidate.nickname);
			this.setSelectGenderRatio();
			return group;
		},
		
		setGroupCountArr() {
			let i = this.options.groupCounts;
			const newResultArr = [];
			this.options.groupLimit = Math.floor(this.remainMembers.length / i);
			for (i; i > 0; i -= 1) {
				// 한그룹당 몇명, 남자, 여자 들어갈 수를 미리 정한다.
				newResultArr.push([]);
			}
			return newResultArr;
		},
		getOneHumanShuffle(candidateList) {
			if (typeof candidateList === 'undefined' || candidateList.length === 0) {
				return false;
			}
			let selectOne = _.sample(candidateList);
			const isSetSelectOne = typeof selectOne === 'undefined';
			if (isSetSelectOne) {
				// if () {

				// }
				this.setSelectGenderRatio();
				return this.getOneHumanShuffle(kmongUtils.getRatio(this.nowGender, false, this.remainMembers));
			} else if (typeof selectOne.nickname === 'undefined') {
				this.setSelectGenderRatio();
				return this.getOneHumanShuffle(kmongUtils.getRatio(this.nowGender, false, this.remainMembers));
			}
			// this.options.exeptionMembers
			// 다시 remainMembers에 넣는 작업
			return selectOne;
		},
		setLeftRemainMembers(theOne) {
			this.remainMembers = _.remove(this.remainMembers, human => human.nickname.toLowerCase() !== theOne.toLowerCase());
		},
		setSelectGenderRatio() {
			if (this.options.considerGender === true) {
				this.calculateConsiderGender();
			} else {
				this.nowGender = (this.nowGender === 'm') ? 'f' : 'm';
			}
		},
		calculateConsiderGender() {
			let nextExpectGender = this.nowGender === 'm' ? 'f' : 'm';
			const fewGender = this.genderRatio > 0.5 ? 'm' : 'f';
			// 소수의 성별일때 
			if (nextExpectGender === fewGender) {
				const genderRatio = this.genderRatio;
				const groupLimit = this.options.groupLimit;
				const groupGenderRatio = genderRatio * groupLimit;
				const groupGenderRatioDecimal = parseInt(Math.round((groupGenderRatio - Math.floor(groupGenderRatio)) * 10)) / 10;
				// const randomValue = Math.random();
				// random이 여자 비율보다 낮으면 ? 
				if ((this.genderDecimal + 0.1) > groupGenderRatioDecimal) {
					this.genderDecimal = 0;
					nextExpectGender = (fewGender === 'm') ? 'f' : 'm';
				}

			} else {
				this.genderDecimal += 0.1;
			}
			this.nowGender = nextExpectGender;
		},
		calculateGenderRatio() {
			this.resultArr.map((group, i) => {
				this.resultArrRatio[i] = {
					index: i,
					ratio: kmongUtils.getRatio('f', 'ratio', this.resultArr[i]),
				};
			});
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
