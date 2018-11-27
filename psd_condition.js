let player = {
	skills: {}
};
let skillsContainer = document.querySelectorAll("#myform table #info b span");

// TODO indexing changes if there are several positions specified
player.skills.Attack = parseInt(skillsContainer[3].innerHTML);
player.skills.Defence = parseInt(skillsContainer[4].innerHTML);
player.skills.Balance = parseInt(skillsContainer[5].innerHTML);
player.skills.Stamina = parseInt(skillsContainer[6].innerHTML);
player.skills.TopSpeed = parseInt(skillsContainer[7].innerHTML);
player.skills.Acceleration = parseInt(skillsContainer[8].innerHTML);
player.skills.Response = parseInt(skillsContainer[9].innerHTML);
player.skills.Agility = parseInt(skillsContainer[10].innerHTML);
player.skills.DribbleAccuracy = parseInt(skillsContainer[11].innerHTML);
player.skills.DribbleSpeed = parseInt(skillsContainer[12].innerHTML);
player.skills.ShortPassAccuracy = parseInt(skillsContainer[13].innerHTML);
player.skills.ShortPassSpeed = parseInt(skillsContainer[14].innerHTML);
player.skills.LongPassAccuracy = parseInt(skillsContainer[15].innerHTML);
player.skills.LongPassSpeed = parseInt(skillsContainer[16].innerHTML);
player.skills.ShotAccuracy = parseInt(skillsContainer[17].innerHTML);
player.skills.ShotPower = parseInt(skillsContainer[18].innerHTML);
player.skills.ShotTechnique = parseInt(skillsContainer[19].innerHTML);
player.skills.FreeKickAccuracy = parseInt(skillsContainer[20].innerHTML);
player.skills.Curling = parseInt(skillsContainer[21].innerHTML);
player.skills.Header = parseInt(skillsContainer[22].innerHTML);
player.skills.Jump = parseInt(skillsContainer[23].innerHTML);
player.skills.Technique = parseInt(skillsContainer[24].innerHTML);
player.skills.Aggression = parseInt(skillsContainer[25].innerHTML);
player.skills.Mentality = parseInt(skillsContainer[26].innerHTML);
player.skills.KeeperSkills = parseInt(skillsContainer[27].innerHTML);
player.skills.Teamwork = parseInt(skillsContainer[28].innerHTML);

let condition = {
	abysmal: -2,
	bad: -1,
	normal: 0,
	good: 1,
	top: 2
};
let validConditions = [condition.abysmal, condition.bad, condition.normal, condition.good, condition.top];

function getSkillsByCondition(condition) {
	if (validConditions.indexOf(condition) === -1) {
		throw "invalid condition";
	}
	
	var actualSkills = {};
	for (let skillName in player.skills) {
		let modifiers = getModifiersForSkill(skillName);
		let calculatedValue = Math.floor(player.skills[skillName] * modifiers[condition])
		actualSkills[skillName] = Math.min(calculatedValue, 99);
	}
	return actualSkills;
}

function getModifiersForSkill(skillName) {
	var modifiers = [];
	modifiers[condition.normal] = 1.00;
	switch (skillName)
	{
		case "Attack":
		case "Defence":
			modifiers[condition.abysmal] = 0.84;
			modifiers[condition.bad] = 0.92;
			modifiers[condition.good] = 1.064;
			modifiers[condition.top] = 1.12;
			break;
		case "Balance":
			modifiers[condition.abysmal] = 0.82;
			modifiers[condition.bad] = 0.88;
			modifiers[condition.good] = 1.06;
			modifiers[condition.top] = 1.12;
			break;
		case "Stamina":
		case "ShotPower":
		case "Jump":
			modifiers[condition.abysmal] = 0.88;
			modifiers[condition.bad] = 0.94;
			modifiers[condition.good] = 1.06;
			modifiers[condition.top] = 1.12;
			break;
		case "TopSpeed":
		case "DribbleSpeed":
		case "FreeKickAccuracy":
		case "Curling":
		case "Technique":
		case "Aggression":
			modifiers[condition.abysmal] = 0.88;
			modifiers[condition.bad] = 0.94;
			modifiers[condition.good] = 1.048;
			modifiers[condition.top] = 1.09;
			break;
		case "Acceleration":
		case "Response":
		case "Agility":
		case "Mentality":
			modifiers[condition.abysmal] = 0.82;
			modifiers[condition.bad] = 0.91;
			modifiers[condition.good] = 1.06;
			modifiers[condition.top] = 1.12;
			break;
		case "DribbleAccuracy":
		case "ShortPassAccuracy":
		case "LongPassAccuracy":
		case "ShotAccuracy":
		case "ShotTechnique":
		case "Header":
			modifiers[condition.abysmal] = 0.91;
			modifiers[condition.bad] = 0.952;
			modifiers[condition.good] = 1.048;
			modifiers[condition.top] = 1.09;
			break;
		case "ShortPassSpeed":
		case "LongPassSpeed":
			modifiers[condition.abysmal] = 0.94;
			modifiers[condition.bad] = 0.97;
			modifiers[condition.good] = 1.03;
			modifiers[condition.top] = 1.06;
			break;
		case "KeeperSkills":
		case "Teamwork":	
			modifiers[condition.abysmal] = 1.00;
			modifiers[condition.bad] = 1.00;
			modifiers[condition.good] = 1.00;
			modifiers[condition.top] = 1.00;		
			break;
	}
	return modifiers;
}

function updateColors() {
	for (let span of skillsContainer) {
		let value = parseInt(span.innerHTML);
		let color = "#FFFFFF";
		if (value >= 95) {
			color = "#FF0000";
		} else if (value >= 90) {
			color = "#FF8000";
		} else if (value >= 80) {
			color = "#FFFF00";
		} else if (value >= 75) {
			color = "#008000";
		} 
		span.style.color = color;
	}
}

function applyCondition(condition) {
	let modifiedSkills = getSkillsByCondition(condition);
	skillsContainer[3].innerHTML = modifiedSkills.Attack;	
	skillsContainer[4].innerHTML = modifiedSkills.Defence;
	skillsContainer[5].innerHTML = modifiedSkills.Balance;
	skillsContainer[6].innerHTML = modifiedSkills.Stamina;
	skillsContainer[7].innerHTML = modifiedSkills.TopSpeed;
	skillsContainer[8].innerHTML = modifiedSkills.Acceleration;
	skillsContainer[9].innerHTML = modifiedSkills.Response;
	skillsContainer[10].innerHTML = modifiedSkills.Agility;
	skillsContainer[11].innerHTML = modifiedSkills.DribbleAccuracy;
	skillsContainer[12].innerHTML = modifiedSkills.DribbleSpeed;
	skillsContainer[13].innerHTML = modifiedSkills.ShortPassAccuracy;
	skillsContainer[14].innerHTML = modifiedSkills.ShortPassSpeed;
	skillsContainer[15].innerHTML = modifiedSkills.LongPassAccuracy;
	skillsContainer[16].innerHTML = modifiedSkills.LongPassSpeed;
	skillsContainer[17].innerHTML = modifiedSkills.ShotAccuracy;
	skillsContainer[18].innerHTML = modifiedSkills.ShotPower;
	skillsContainer[19].innerHTML = modifiedSkills.ShotTechnique;
	skillsContainer[20].innerHTML = modifiedSkills.FreeKickAccuracy;
	skillsContainer[21].innerHTML = modifiedSkills.Curling;
	skillsContainer[22].innerHTML = modifiedSkills.Header;
	skillsContainer[23].innerHTML = modifiedSkills.Jump;
	skillsContainer[24].innerHTML = modifiedSkills.Technique;
	skillsContainer[25].innerHTML = modifiedSkills.Aggression;
	skillsContainer[26].innerHTML = modifiedSkills.Mentality;
	skillsContainer[27].innerHTML = modifiedSkills.KeeperSkills;
	skillsContainer[28].innerHTML = modifiedSkills.Teamwork;	
	updateColors();
}