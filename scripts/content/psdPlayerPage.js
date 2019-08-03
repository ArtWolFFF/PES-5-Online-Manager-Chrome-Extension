(function() { 

let player = {
	skills: {}
};

let condition = {
	abysmal: -2,
	bad: -1,
	normal: 0,
	good: 1,
	top: 2
};
let conditions = [condition.abysmal, condition.bad, condition.normal, condition.good, condition.top];
let skillsContainer = document.querySelectorAll("#myform table #info b span");

function initialize() {
	let firstSkill = "Attack";
	let i = 0;
	for (let span of skillsContainer) {
		let prevSibling = span.parentElement.previousSibling;
		if (prevSibling != null && prevSibling.textContent.indexOf(firstSkill) > -1) {
			/* found first skill name text element */
			prevSibling = prevSibling.previousSibling;
			let br = document.createElement("br");
			let conditionSelector = document.createElement("select");
			let abysmalOption = document.createElement("option");
			abysmalOption.value = condition.abysmal;
			abysmalOption.innerText = "Abysmal ↓";			
			abysmalOption.style.color = "purple";
			abysmalOption.style.fontWeight = "bold";
			let badOption = document.createElement("option");
			badOption.value = condition.bad;
			badOption.innerText = "Poor";
			badOption.style.color = "blue";
			badOption.style.fontWeight = "bold";
			let normalOption = document.createElement("option");
			normalOption.value = condition.normal;
			normalOption.innerText = "Normal →";
			normalOption.selected = "selected";
			normalOption.style.color = "green";
			normalOption.style.fontWeight = "bold";
			let goodOption = document.createElement("option");
			goodOption.value = condition.good;
			goodOption.innerText = "Good";
			goodOption.style.color = "Orange";
			goodOption.style.fontWeight = "bold";
			let topOption = document.createElement("option");
			topOption.value = condition.top;
			topOption.innerText = "Top ↑";
			topOption.style.color = "red";
			topOption.style.fontWeight = "bold";
			conditionSelector.appendChild(topOption);
			conditionSelector.appendChild(goodOption);
			conditionSelector.appendChild(normalOption);
			conditionSelector.appendChild(badOption);
			conditionSelector.appendChild(abysmalOption);
			let selectorText = document.createElement("span");
			selectorText.innerText = "Condition: ";
			
			prevSibling.parentElement.insertBefore(br, prevSibling);
			prevSibling.parentElement.insertBefore(conditionSelector, prevSibling);			
			prevSibling.parentElement.insertBefore(selectorText, conditionSelector);
			prevSibling.parentElement.insertBefore(br, conditionSelector);
			prevSibling.parentElement.insertBefore(br, prevSibling);
			
			conditionSelector.onchange = function(e) {
				applyCondition(parseInt(e.target.value));
			};
			break;
		}
		i++;
	}
	return i;
}

let startIdx = initialize();
player.skills.Attack = parseInt(skillsContainer[startIdx].innerHTML);
player.skills.Defence = parseInt(skillsContainer[startIdx + 1].innerHTML);
player.skills.Balance = parseInt(skillsContainer[startIdx + 2].innerHTML);
player.skills.Stamina = parseInt(skillsContainer[startIdx + 3].innerHTML);
player.skills.TopSpeed = parseInt(skillsContainer[startIdx + 4].innerHTML);
player.skills.Acceleration = parseInt(skillsContainer[startIdx + 5].innerHTML);
player.skills.Response = parseInt(skillsContainer[startIdx + 6].innerHTML);
player.skills.Agility = parseInt(skillsContainer[startIdx + 7].innerHTML);
player.skills.DribbleAccuracy = parseInt(skillsContainer[startIdx + 8].innerHTML);
player.skills.DribbleSpeed = parseInt(skillsContainer[startIdx + 9].innerHTML);
player.skills.ShortPassAccuracy = parseInt(skillsContainer[startIdx + 10].innerHTML);
player.skills.ShortPassSpeed = parseInt(skillsContainer[startIdx + 11].innerHTML);
player.skills.LongPassAccuracy = parseInt(skillsContainer[startIdx + 12].innerHTML);
player.skills.LongPassSpeed = parseInt(skillsContainer[startIdx + 13].innerHTML);
player.skills.ShotAccuracy = parseInt(skillsContainer[startIdx + 14].innerHTML);
player.skills.ShotPower = parseInt(skillsContainer[startIdx + 15].innerHTML);
player.skills.ShotTechnique = parseInt(skillsContainer[startIdx + 16].innerHTML);
player.skills.FreeKickAccuracy = parseInt(skillsContainer[startIdx + 17].innerHTML);
player.skills.Curling = parseInt(skillsContainer[startIdx + 18].innerHTML);
player.skills.Header = parseInt(skillsContainer[startIdx + 19].innerHTML);
player.skills.Jump = parseInt(skillsContainer[startIdx + 20].innerHTML);
player.skills.Technique = parseInt(skillsContainer[startIdx + 21].innerHTML);
player.skills.Aggression = parseInt(skillsContainer[startIdx + 22].innerHTML);
player.skills.Mentality = parseInt(skillsContainer[startIdx + 23].innerHTML);
player.skills.KeeperSkills = parseInt(skillsContainer[startIdx + 24].innerHTML);
player.skills.Teamwork = parseInt(skillsContainer[startIdx + 25].innerHTML);


function getSkillsByCondition(condition) {
	if (conditions.indexOf(condition) === -1) {
		throw "invalid condition";
	}
	
	var actualSkills = {};
	for (let skillName in player.skills) {
		let modifiers = getModifiersForSkill(skillName);
		let calculatedValue = Math.floor(player.skills[skillName] * modifiers[condition]);
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
	for (let i = startIdx; i < skillsContainer.length; i++) {
		let span = skillsContainer[i];
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

/* Applies the selected player condition, recalculates player's attribute values */
function applyCondition(condition) {
	let modifiedSkills = getSkillsByCondition(condition);
	skillsContainer[startIdx].innerHTML = modifiedSkills.Attack;	
	skillsContainer[startIdx + 1].innerHTML = modifiedSkills.Defence;
	skillsContainer[startIdx + 2].innerHTML = modifiedSkills.Balance;
	skillsContainer[startIdx + 3].innerHTML = modifiedSkills.Stamina;
	skillsContainer[startIdx + 4].innerHTML = modifiedSkills.TopSpeed;
	skillsContainer[startIdx + 5].innerHTML = modifiedSkills.Acceleration;
	skillsContainer[startIdx + 6].innerHTML = modifiedSkills.Response;
	skillsContainer[startIdx + 7].innerHTML = modifiedSkills.Agility;
	skillsContainer[startIdx + 8].innerHTML = modifiedSkills.DribbleAccuracy;
	skillsContainer[startIdx + 9].innerHTML = modifiedSkills.DribbleSpeed;
	skillsContainer[startIdx + 10].innerHTML = modifiedSkills.ShortPassAccuracy;
	skillsContainer[startIdx + 11].innerHTML = modifiedSkills.ShortPassSpeed;
	skillsContainer[startIdx + 12].innerHTML = modifiedSkills.LongPassAccuracy;
	skillsContainer[startIdx + 13].innerHTML = modifiedSkills.LongPassSpeed;
	skillsContainer[startIdx + 14].innerHTML = modifiedSkills.ShotAccuracy;
	skillsContainer[startIdx + 15].innerHTML = modifiedSkills.ShotPower;
	skillsContainer[startIdx + 16].innerHTML = modifiedSkills.ShotTechnique;
	skillsContainer[startIdx + 17].innerHTML = modifiedSkills.FreeKickAccuracy;
	skillsContainer[startIdx + 18].innerHTML = modifiedSkills.Curling;
	skillsContainer[startIdx + 19].innerHTML = modifiedSkills.Header;
	skillsContainer[startIdx + 20].innerHTML = modifiedSkills.Jump;
	skillsContainer[startIdx + 21].innerHTML = modifiedSkills.Technique;
	skillsContainer[startIdx + 22].innerHTML = modifiedSkills.Aggression;
	skillsContainer[startIdx + 23].innerHTML = modifiedSkills.Mentality;
	skillsContainer[startIdx + 24].innerHTML = modifiedSkills.KeeperSkills;
	skillsContainer[startIdx + 25].innerHTML = modifiedSkills.Teamwork;	
	updateColors();
}

})();