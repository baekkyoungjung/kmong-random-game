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
		return Object.keys(kmongMembers).length;
	}
	getRatio() {
		let genderRatio = 0;
		Object.keys(kmongMembers).map(memberKey => {
			if (kmongMembers[memberKey].gender === 'f') {
				genderRatio += 1;
			}
		});

		genderRatio /= this.kmongMembersLength();
		genderRatio *= 100;
		genderRatio = parseInt(genderRatio);

		return genderRatio;
	}
}

export default new kmongUtils();
