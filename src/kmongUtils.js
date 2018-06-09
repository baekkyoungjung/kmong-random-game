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
	getRatio(type = 'f', isRatio = false, memberLists = kmongMembers) {
		// let genderRatio = 0;
		let getType = 'gender';
		switch (type) {
			case 'f':
			case 'm': {
				getType = 'gender';
				break;
			}
			case 'dev':
			case 'management':
			case 'operation':
			case 'marketing':
			case 'c': {
				getType = 'team';
				break;
			}
			default: {
				break;
			}
		};
		let lists = [];
		memberLists.map(member => {
			if (member[getType] === type) {
				lists.push(member);
				// genderRatio += 1;
			}
		});
		if (isRatio !== 'ratio') {
			return lists;
		}
		let genderRatio = lists.length;
		genderRatio /= memberLists.length;
		genderRatio *= 1000;
		genderRatio = Math.round(Math.round(genderRatio) / 10) / 100;

		return genderRatio;
	}
}

export default new kmongUtils();
