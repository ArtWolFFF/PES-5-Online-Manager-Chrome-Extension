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
			
			/* Condition selector elements */
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
			
			let br3 = document.createElement("br");
			prevSibling.parentElement.insertBefore(br, prevSibling);
			prevSibling.parentElement.insertBefore(br3, prevSibling);
			prevSibling.parentElement.insertBefore(conditionSelector, prevSibling);			
			prevSibling.parentElement.insertBefore(selectorText, conditionSelector);
			prevSibling.parentElement.insertBefore(br, conditionSelector);
			prevSibling.parentElement.insertBefore(br, prevSibling);
			
			/* Salary elements */
			let salaryText = document.createElement("span");
			salaryText.innerText = "Зарплата на проекте: ";
			let salaryValueText = document.createElement("b");
			salaryValueText.className = "salary-value";
			salaryValueText.innerText = "-";
			
			let br2 = document.createElement("br");
			
			prevSibling.parentElement.insertBefore(br2, conditionSelector);	
			prevSibling.parentElement.insertBefore(br2, prevSibling);				
			prevSibling.parentElement.insertBefore(salaryText, prevSibling);
			prevSibling.parentElement.insertBefore(salaryValueText, prevSibling);	
			prevSibling.parentElement.insertBefore(br2, salaryValueText);
			prevSibling.parentElement.insertBefore(br2, prevSibling);
			
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

var salary = calculateSalary(player);
document.getElementsByClassName("salary-value")[0].innerText = salary;


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

function calculateSalary(player) {
	let skillSumFactors	= {
		1900: 0.6,
		2100: 0.6,		
		2200: 0.8,
		2300: 0.8,
		2350: 0.8,
		2400: 1,
		2450: 1,
		2550: 1,
		2650: 1.1,
		2700: 1.2,
		2750: 1.2,
		2850: 1.2,
		2955: 1.2,
		3050: 1.4,
		3150: 2,
		3250: 2,
		3300: 2,
		3350: 2,
		3750: 2.3,
		3800: 1.9
	};
	
	function getEffectiveSkillSum(player) {
		let commonSkillsFactor = {
			50:	0.0,
			80:	1.0,
			84:	1.5,
			87:	2.0,
			90:	1.5,
			94:	2.0,
			99:	3.0
		};
		
		let defenceSkillFactor = {
			50:	0.0,
			80:	1.0,
			84:	2.5,
			87:	4.0,
			90:	4.0,
			94:	5.0,
			99:	6.0
		};
		
		let keeperSkillsFactor = {
			50:	0.0,
			80:	1.0,
			84:	5.0,
			87:	5.0,
			90:	5.0,
			94:	5.0,
			99:	5.0
		};
		
		let passStaminaMentalTeamworkFactor = {
			50:	0.0,
			80:	1.0,
			84:	1.0,
			87: 1.0,
			90:	1.2,
			94:	1.2,
			99:	1.2
		};
		
		let speedAgilityFactor = {
			50:	0.0,
			80:	1.0,
			84:	1.3,
			87:	1.5,
			90:	2.5,
			94:	2.4,
			99:	3.0
		}
		
		let techniqueFactor = {
			50:	0.0,
			80:	1.0,
			84:	1.1,
			87:	1.3,
			90:	1.5,
			94:	1.8,
			99:	2.0
		}
		
		let shotAccuracyAndTechniqueFactor = {
			50:	0.0,
			80:	1.0,
			84:	1.2,
			87:	1.3,
			90:	1.5,
			94:	2.0,
			99:	2.5
		}
		
		let balanceAndShotPowerFactor = {
			50:	0.0,
			80:	1.0,
			84:	2.0,
			87:	3.0,
			90:	3.0,
			94:	4.0,
			99:	6.0
		}
		
		function calculateEffectiveSkillValue(skillValue, factors) {
			let appliedFactor = 0.0;
			let takeNextFactor = false;
			for (let factor in factors) {
				if (takeNextFactor) {
					appliedFactor = factors[factor];
				}
				takeNextFactor = skillValue >= factor;
			}
			return skillValue * appliedFactor;
		}
		
		var effectiveSkillSum =
			calculateEffectiveSkillValue(player.skills.Attack, commonSkillsFactor)
			+ calculateEffectiveSkillValue(player.skills.Defence, defenceSkillFactor)
			+ calculateEffectiveSkillValue(player.skills.Balance, balanceAndShotPowerFactor)
			+ calculateEffectiveSkillValue(player.skills.Stamina, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.TopSpeed, speedAgilityFactor)
			+ calculateEffectiveSkillValue(player.skills.Acceleration, speedAgilityFactor) 
			+ calculateEffectiveSkillValue(player.skills.Response, commonSkillsFactor)
			+ calculateEffectiveSkillValue(player.skills.Agility, speedAgilityFactor)
			+ calculateEffectiveSkillValue(player.skills.DribbleAccuracy, techniqueFactor)
			+ calculateEffectiveSkillValue(player.skills.DribbleSpeed, speedAgilityFactor)
			+ calculateEffectiveSkillValue(player.skills.ShortPassAccuracy, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.ShortPassSpeed, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.LongPassAccuracy, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.LongPassSpeed, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.ShotAccuracy, shotAccuracyAndTechniqueFactor)
			+ calculateEffectiveSkillValue(player.skills.ShotPower, balanceAndShotPowerFactor)			
			+ calculateEffectiveSkillValue(player.skills.ShotTechnique, shotAccuracyAndTechniqueFactor)
			+ calculateEffectiveSkillValue(player.skills.FreeKickAccuracy, commonSkillsFactor) // check
			+ calculateEffectiveSkillValue(player.skills.Curling, commonSkillsFactor) // check
			+ calculateEffectiveSkillValue(player.skills.Header, commonSkillsFactor)
			+ calculateEffectiveSkillValue(player.skills.Jump, commonSkillsFactor)
			+ calculateEffectiveSkillValue(player.skills.Technique, techniqueFactor)
			+ calculateEffectiveSkillValue(player.skills.Aggression, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.Mentality, passStaminaMentalTeamworkFactor)
			+ calculateEffectiveSkillValue(player.skills.KeeperSkills, keeperSkillsFactor)
			+ calculateEffectiveSkillValue(player.skills.Teamwork, passStaminaMentalTeamworkFactor);
			
		return effectiveSkillSum;
	}
	
	let effectiveSkillSum = getEffectiveSkillSum(player);	
	let appliedFactor = 0.6;
	let takeNextFactor = false;
	for (let skillSum in skillSumFactors) {
		if (takeNextFactor) {		
			appliedFactor = skillSumFactors[skillSum];
		}
		takeNextFactor = effectiveSkillSum >= skillSum;
	}
	let effectiveSalary = effectiveSkillSum * appliedFactor;	
	let roundedSalary = Math.round(effectiveSalary / 100) * 100;
	return roundedSalary;
}

})();