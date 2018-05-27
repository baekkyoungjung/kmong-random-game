import { kmongMembers, kmongTeams, previousResults } from './importData';

let instance = null;

class kmongUtils {
	constructor() {
		[
		].forEach(method => (this[method] = this[method].bind(this)));

		if (!instance) {
			instance = this;
		}

		return instance;
	}
	kmongMembersLength() {
		return kmongMembers.length;
	}
	getRatio(gender = 'f', isRatio = false) {
		// let genderRatio = 0;
		let lists = [];
		kmongMembers.map(member => {
			if (member.gender === gender) {
				lists.push(member);
				// genderRatio += 1;
			}
		});
		if (isRatio !== 'ratio') {
			return lists;
		}
		let genderRatio = lists.length;
		genderRatio /= this.kmongMembersLength();
		genderRatio *= 100;
		genderRatio = parseInt(genderRatio);

		return genderRatio;
	}
}

export default new kmongUtils();
