/***
DISCLAIMER

This extension uses third-party resources that may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner.
The authors of this extension do not have any control of the aforementioned third-party resources and do not hold any legal responsibility for the content that these third-party resources may provide.
All the data, such as match results and competition standings listed in this extension, is entirely fictional.
This extension was never intended for any commercial or personal gain.
Credits for wonderful icons go to iconfinder.com.

***/

'use strict';

/* DATA */

/* League Manager Online data*/
let lmo = {
    baseUrl: "http://lmo.online.gamma.mtw.ru/lmo.php",
    getLeagueTableUrl: function (leagueId) {
        return `${lmo.baseUrl}?action=table&file=${leagueId}`;
    },
    getTeamCalendarUrl: function (leagueId, teamId) {
        return `${lmo.baseUrl}?action=program&file=${leagueId}&selteam=${teamId}`;
    },
    getLeagueRosterUrl: function (leagueId) {
        return `${lmo.baseUrl}?action=program&file=${leagueId}`;
    }
};

let league = {
    SerieA: "seriea12.l98",
    Ligue1: "ligue112.l98",
    LaLiga: "laliga12.l98",
    EuroLeague: "euro12.l98",
    EPL: "epl12.l98",
    Bundesliga: "bundes12.l98"
};

let leagueNames = {
};
leagueNames[league.SerieA] = "Serie A";
leagueNames[league.Ligue1] = "Ligue 1";
leagueNames[league.LaLiga] = "La Liga";
leagueNames[league.EuroLeague] = "EuroLeague";
leagueNames[league.EPL] = "English Premier League";
leagueNames[league.Bundesliga] = "Bundesliga";

let teamsByLeague = {
};
teamsByLeague[league.SerieA] = [];
teamsByLeague[league.Ligue1] = [];
teamsByLeague[league.LaLiga] = [];
teamsByLeague[league.EuroLeague] = [];
teamsByLeague[league.EPL] = [];
teamsByLeague[league.Bundesliga] = [];

let currentLeague = null;//league.SerieA;
let currentTeam = null;//"Cagliari Calcio";
let currentTeamId = null;//"8";
let teamLogoUrl = null;//"http://lmo.online.gamma.mtw.ru/img/teams/small/Cagliari%20Calcio.png";

let globalData = {
    getCurrentTeam: function () {
        return currentTeam;
    },
    setCurrentTeam: function (value) {
        currentTeam = value;
        chrome.storage.sync.set({ currentTeam: currentTeam }, function (v) {
        });
    },
    getCurrentTeamId: function () {
        return currentTeamId;
    },
    setCurrentTeamId: function (value) {
        currentTeamId = value;
        chrome.storage.sync.set({ currentTeamId: currentTeamId }, function (v) {
        });
    },
    getCurrentLeague: function () {
        return currentLeague;
    },
    setCurrentLeague: function (value) {
        currentLeague = value;
        chrome.storage.sync.set({ currentLeague: currentLeague }, function (v) {
        });
    },
    getCurrentTeamLogourl: function () {
        return teamLogoUrl;
    },
    setCurrentTeamLogourl: function (value) {
        teamLogoUrl = value;
        chrome.storage.sync.set({ teamLogoUrl: teamLogoUrl }, function (v) {
        });
    }
}

let nearestFixtures = [];
let allFixtures = [];
let Outcome = {
    Win: "win",
    Draw: "draw",
    Loss: "loss"
};


var parser = new DOMParser();

/**
Object for load state tracking.
If any segments are reloading, the content of the page temporarily becomes invisible until all components finish loading.
This is done to prevent annoying jumps and flickering in the UI.
**/
let loadState = {
    headerUpdated: true,
    nearestFixturesUpdated: true,
    leagueTableUpdated: true,
    linksUpdated: true,
    managerContactsUpdated: true,
    reset: function () {
        loadState.headerUpdated = false;
        loadState.nearestFixturesUpdated = false;
        loadState.leagueTableUpdated = false;
        loadState.linksUpdated = false;
        loadState.managerContactsUpdated = false;
    },
    allComponentsLoaded: function () {
        return loadState.headerUpdated
            && loadState.nearestFixturesUpdated
            && loadState.leagueTableUpdated
            && loadState.linksUpdated
            && loadState.managerContactsUpdated;
    }
};

let leagueSelector = document.getElementById('league-selector');
let clubSelector = document.getElementById('club-selector');
/* END DATA */

/* UTILS */
HTMLElement.prototype.hide = function (toggleVisibility) {
    if (toggleVisibility) {
        this.style.visibility = "hidden";
    } else {
        this.style.display = "none";
    }
}

HTMLElement.prototype.show = function (toggleVisibility) {
    if (toggleVisibility) {
        this.style.visibility = "visible";
    } else {
        this.style.display = "block";
    }
}

function checkFetchResponseEncoding(response) {
    console.log(response.headers.get('Content-Type'));
    return response;
}

function countInstances(str, word) {
    return str.split(word).length - 1;
}

/* END UTILS */

/* LINKS */
let matchTopicLinks = {};
matchTopicLinks[league.SerieA] = "https://vk.com/topic-54185875_47782167";
matchTopicLinks[league.Ligue1] = "https://vk.com/topic-54185875_47782047";
matchTopicLinks[league.LaLiga] = "https://vk.com/topic-54185875_47784145";
matchTopicLinks[league.EuroLeague] = "https://vk.com/topic-54185875_47778143";
matchTopicLinks[league.EPL] = "https://vk.com/topic-54185875_47777140";
matchTopicLinks[league.Bundesliga] = "https://vk.com/topic-54185875_47782686";

let coachListLinks = {};
coachListLinks[league.SerieA] = "https://vk.com/topic-54185875_37150957?post=87359";
coachListLinks[league.Ligue1] = "https://vk.com/topic-54185875_37150957?post=87362";
coachListLinks[league.LaLiga] = "https://vk.com/topic-54185875_37150957?post=87358";
coachListLinks[league.EuroLeague] = "https://vk.com/topic-54185875_37150957?post=87363";
coachListLinks[league.EPL] = "https://vk.com/topic-54185875_37150957?post=87357";
coachListLinks[league.Bundesliga] = "https://vk.com/topic-54185875_37150957?post=87360";

let managerListUrl = "https://vk.com/topic-54185875_37150957";
let rulesUrl = "https://vk.com/wel9_online?w=page-54185875_44626803";
let faqUrl = "https://vk.com/wel9_online?w=page-54185875_49853606";
let tutorialUrl = "https://vk.com/page-54185875_44626921";

function setUpLinks(leagueId) {
    document.getElementById("lmo-link").setAttribute("href", lmo.baseUrl);
    let coachListUrl = coachListLinks[leagueId];
    //document.getElementById("coaches-list-link").setAttribute("href", coachListUrl);
    document.getElementById("rules-link").setAttribute("href", rulesUrl);
    document.getElementById("faq-link").setAttribute("href", faqUrl);
    document.getElementById("tutorial-link").setAttribute("href", tutorialUrl);
    let reportMatchUrl = matchTopicLinks[leagueId];
    document.getElementById("report-match-link").setAttribute("href", reportMatchUrl);
    let leagueTableUrl = lmo.getLeagueTableUrl(leagueId);
    document.getElementById("tournament-table-link").setAttribute("href", leagueTableUrl);
    document.getElementsByClassName("error-description")[0].innerText = "Ошибка загрузки расширения. Для корректной работы требуются подключение к интернету и доступность страницы " + lmo.baseUrl + ". Если подключение к интернету присутствует, убедитесь, что доступ к указанной выше странице не ограничен в настройках расширения.";

    loadState.linksUpdated = true;
}

/* END LINKS */


/* LEAGUE TABLE SNIPPET */
function parseLeagueTablePage(content) {
    /* Data structure for league standings */
    let leagueTableData = {
        currentPosition: 0,
        standings: [
            //{        
            //    position: 1,
            //    teamName: currentTeam,
            //    logoUrl: teamLogoUrl,
            //    gamesPlayed: 0,
            //    points: 0
            //}
        ]
    };
    let htmlDoc = parser.parseFromString(content, 'text/html');
    let rows = htmlDoc.querySelectorAll('.lmoInner tr');
    let rowsCount = rows.length;
    let i = 0;
    for (let row of rows) {
        i++;
        if (i == 1 || i == rowsCount) {
            // disregard first and last row
            continue;
        }
        let team = {
            position: parseInt(row.children[0].innerText),
            teamName: row.children[3].innerText.trim(),
            logoUrl: row.children[2].children[0].src,
            gamesPlayed: parseInt(row.children[7].innerText),
            points: parseInt(row.children[17].innerText)
        };
        leagueTableData.standings.push(team);

        if (team.teamName == currentTeam) {
            leagueTableData.currentPosition = i - 1;
        }
    }

    return Promise.resolve(leagueTableData);
}

function applyLeagueTableInfo(leagueTableInfo) {
    let currentTeamPosition = leagueTableInfo.currentPosition;
    document.getElementsByClassName('club-position')[0].innerText = currentTeamPosition;
    let teamsInLeague = leagueTableInfo.standings.length;
    let snippetDelta = 3; // количество команд выше и ниже выбранной команды, которое показывается в сниппете таблицы
    let snippetStartIdx = Math.max(1, currentTeamPosition - snippetDelta);
    let snippetEndIdx = Math.min(teamsInLeague, currentTeamPosition + snippetDelta);

    let leagueTableContainer = document.querySelector('.tournament-table tbody');
    leagueTableContainer.innerHTML = '<tr class="league-table-header-row"><td></td><td></td><td></td><td class="table-games-cell"><span class="table-games unobtrusive-header">И</span></td><td><span class="table-points unobtrusive-header">О</span></td></tr>';

    for (let i = snippetStartIdx; i <= snippetEndIdx; i++) {
        let team = leagueTableInfo.standings[i - 1];
        let row = document.createElement('tr');

        if (team.teamName == currentTeam) {
            row.className = "highlighted-team";
        }

        let teamPosition = document.createElement('td');
        let teamPositionSpan = document.createElement('span');
        teamPositionSpan.innerText = team.position + ".";
        teamPositionSpan.className = "table-position";
        teamPosition.appendChild(teamPositionSpan);
        row.appendChild(teamPosition);

        let logoTd = document.createElement('td');
        let logoImg = document.createElement('img');
        logoImg.src = team.logoUrl;
        logoImg.width = 20;
        logoImg.height = 20;
        logoImg.className = "table-club-logo";
        logoTd.appendChild(logoImg);
        row.appendChild(logoTd);

        let teamNameTd = document.createElement('td');
        let teamNameSpan = document.createElement('span');
        teamNameSpan.innerText = team.teamName;
        teamNameSpan.className = "table-club-name";
        if (team.teamName == currentTeam) {
            teamNameSpan.className += " my-club-name";
        }
        teamNameTd.appendChild(teamNameSpan);
        row.appendChild(teamNameTd);

        let gamesPlayedTd = document.createElement('td');
        gamesPlayedTd.className = "table-games-cell";
        let gamesPlayedSpan = document.createElement('span');
        gamesPlayedSpan.innerText = team.gamesPlayed;
        gamesPlayedSpan.className = "table-games";
        gamesPlayedTd.appendChild(gamesPlayedSpan);
        row.appendChild(gamesPlayedTd);

        let pointsTd = document.createElement('td');
        let pointsSpan = document.createElement('span');
        pointsSpan.innerText = team.points;
        pointsSpan.className = "table-points";
        pointsTd.appendChild(pointsSpan);
        row.appendChild(pointsTd);

        leagueTableContainer.appendChild(row);
    }

    loadState.leagueTableUpdated = true;
    return true;
}

function setUpLeagueTable(leagueId) {
    let lmoTableUrl = lmo.getLeagueTableUrl(leagueId);
    fetch(lmoTableUrl)
        .then(response => response.text())
        .then(parseLeagueTablePage)
        .then(applyLeagueTableInfo)
        .catch(function (error) {
            console.error(error);
            console.trace();
        });
}
/* END LEAGUE TABLE SNIPPET */



/* NEAREST FIXTURES SNIPPET */
function parseTeamCalendarPage(content) {
    /* Data structure for fixtures */
    let fixtures = [
        //{
        //    fixtureId: 1,
        //    homeTeam: "AC Milan",
        //    homeTeamLogoUrl: "http://lmo.online.gamma.mtw.ru/img/teams/small/AC%20Milan.png",
        //    awayTeam: "Cagliari Calcio",
        //    awayTeamLogoUrl: "http://lmo.online.gamma.mtw.ru/img/teams/small/Cagliari%20Calcio.png",
        //    homeTeamGoals: 1,
        //    awayTeamGoals: 2,
        //    concluded: true
        //}
    ];
    let htmlDoc = parser.parseFromString(content, 'text/html');
    let rows = htmlDoc.querySelectorAll('.lmoInner tr');
	
    for (let row of rows) {
        let isPlayed = row.querySelectorAll('td[align=right]')[1].innerText != "_";
        let homeTeam = row.querySelectorAll('td[align=right]')[0].innerText.trim();
        let awayTeam = row.querySelectorAll('td[align=left]')[0].innerText.trim();
        let additionalInfoContainers = row.getElementsByClassName("popup");
        let isTechnicalDefeat = false;
        let technicalWinner = null;
        let matchReportLink = null;

        for (let container of additionalInfoContainers) {
            let popupHtml = container.innerHTML;

            let isTechnicalDefeatPopup = popupHtml.toLowerCase().includes('round table decision');
            if (isTechnicalDefeatPopup) {
                isTechnicalDefeat = true;
                if (countInstances(popupHtml, homeTeam) === 2) {
                    technicalWinner = homeTeam;
                } else if (countInstances(popupHtml, awayTeam) === 2) {
                    technicalWinner = awayTeam;
                }
            }

            let isMatchReportPopup = popupHtml.toLowerCase().includes('match report');
            if (isMatchReportPopup) {
                matchReportLink = container.parentElement.href;
            }            
        }

        let fixture = {
            fixtureId: parseInt(row.children[0].innerText.trim()),
            homeTeam: homeTeam,
            homeTeamLogoUrl: row.getElementsByTagName('img')[0].src,
            awayTeam: awayTeam,
            awayTeamLogoUrl: row.getElementsByTagName('img')[1].src,
            homeTeamGoals: isPlayed ? parseInt(row.querySelectorAll('td[align=right]')[1].innerText) : 0,
            awayTeamGoals: isPlayed ? parseInt(row.querySelectorAll('td[align=left]')[1].innerText) : 0,
            concluded: isPlayed || isTechnicalDefeat,
            isTechnicalDefeat: isTechnicalDefeat,
            technicalWinner: technicalWinner,
			matchReportLink: matchReportLink
        };

        fixtures.push(fixture);
    }
    allFixtures = fixtures; // saving globally for later use

    return Promise.resolve(fixtures);
}

function applyFixturesInfo(fixtures) {
    // apply fixtures for full calendar
    applyFixtures(fixtures, true);

    let fixturesDelta = 3;
    let concludedFixtures = fixtures
        .filter(f => f.concluded)
        .sort(f => f.fixtureId);

    let recentlyConcludedFixtures = concludedFixtures
        .slice(Math.max(0, concludedFixtures.length - fixturesDelta), concludedFixtures.length);
    let upcomingFixtures = fixtures
        .filter(f => !f.concluded)
        .sort(f => f.fixtureId)
        .slice(0, fixturesDelta);

    let snippetFixtures = [];
    snippetFixtures = snippetFixtures.concat(recentlyConcludedFixtures);
    snippetFixtures = snippetFixtures.concat(upcomingFixtures);

    nearestFixtures = snippetFixtures;  // saving globally for later use
    // apply "nearest fixtures"
    return applyFixtures(snippetFixtures);
}

function applyFixtures(fixtures, applyAllFixtures) {
    let fixturesContainer = !applyAllFixtures
        ? document.querySelector('.nearest-fixtures-table tbody')
        : document.querySelector('.full-calendar-table tbody');
    fixturesContainer.innerHTML = ''; // remove all current data

    for (let fixture of fixtures) {
        let isHomeMatch = fixture.homeTeam == currentTeam;
        let opponent = isHomeMatch ? fixture.awayTeam : fixture.homeTeam;
        let opponentLogoUrl = isHomeMatch ? fixture.awayTeamLogoUrl : fixture.homeTeamLogoUrl;
        let myGoals = fixture.concluded
            ? isHomeMatch ? fixture.homeTeamGoals : fixture.awayTeamGoals
            : "-";
        let opponentGoals = fixture.concluded
            ? !isHomeMatch ? fixture.homeTeamGoals : fixture.awayTeamGoals
            : "-";
        let outcome = myGoals > opponentGoals
            ? Outcome.Win
            : myGoals < opponentGoals ? Outcome.Loss : Outcome.Draw;

        if (fixture.isTechnicalDefeat) {
            if (fixture.technicalWinner === currentTeam) {
                outcome = Outcome.Win;
                myGoals = "+";
                opponentGoals = "\u2212";
            } else {
                outcome = Outcome.Loss;
                opponentGoals = "+";
                myGoals = "\u2212";
            }            
        }

        let row = document.createElement('tr');

        let fixtureNumberTd = document.createElement('td');
        fixtureNumberTd.className = "fixture-number-cell";
        let fixtureNumberSpan = document.createElement('div');
        fixtureNumberSpan.className = "fixture-number";
        fixtureNumberSpan.innerText = "Тур " + fixture.fixtureId;
        fixtureNumberTd.appendChild(fixtureNumberSpan);
        row.appendChild(fixtureNumberTd);


        let opponentlogoTd = document.createElement('td');
        let logoImg = document.createElement('img');
        logoImg.src = opponentLogoUrl;
        logoImg.width = 20;
        logoImg.height = 20;
        logoImg.className = "fixture-opponent-logo";
        opponentlogoTd.appendChild(logoImg);
        row.appendChild(opponentlogoTd);

        let opponentTd = document.createElement('td');
        let opponentSpan = document.createElement('div');
        opponentSpan.className = "fixture-opponent-name";
        opponentSpan.innerText = opponent;
        opponentTd.appendChild(opponentSpan);
        row.appendChild(opponentTd);

        let outcomeTd = document.createElement('td');
        outcomeTd.className = "fixture-result-container";
        let outcomeSpan = document.createElement('div');
        outcomeSpan.className = outcome;
		let score = `${myGoals}:${opponentGoals}`;
        outcomeSpan.innerHTML = fixture.matchReportLink == null ? score : `<a class='match-report-link' href='${fixture.matchReportLink}' target='_blank'>${score}</a>`;//score;
        outcomeTd.appendChild(outcomeSpan);
        row.appendChild(outcomeTd);

        let homeAwayTd = document.createElement('td');
        let homeAwaySpan = document.createElement('div');
        homeAwaySpan.className = "home-away";
        homeAwaySpan.innerHTML = isHomeMatch ? "(д)" : "(г)";
        homeAwayTd.appendChild(homeAwaySpan);
        row.appendChild(homeAwayTd);

    let buttonTd = document.createElement('td');
    if (!fixture.concluded) {
        let contactManagerBtn = document.createElement('a');
        contactManagerBtn.className = "contact-manager-link disabled";        
        contactManagerBtn.target = "_blank";
        contactManagerBtn.href = "javascript:void(0);";
        contactManagerBtn.title = "Написать тренеру";
        buttonTd.appendChild(contactManagerBtn);
    }
    row.appendChild(buttonTd);

        fixturesContainer.appendChild(row);
    }

    setUpManagersInfo();

    loadState.nearestFixturesUpdated = true;
    return true;
}

function applyManagerPageData(content) {
    //let managerList = [
    //    //{
    //    //    teamName: "",
    //    //    managerId: ""
    //    //}
    //];

    let htmlDoc = parser.parseFromString(content, 'text/html');
    let links = htmlDoc.querySelectorAll('.bp_text a');
    let teamsInLeague = teamsByLeague[globalData.getCurrentLeague()];
    let fixtureOpponentNameElements = document.getElementsByClassName('fixture-opponent-name');
    for (let link of links) {
        let possibleClubName = link.previousSibling;
        try {
            // cut out all sorts of long dashes
            possibleClubName = possibleClubName.textContent.replace(/\u2013|\u2014|\u2012|\u2015/g, "").trim();
            if (possibleClubName.endsWith("-") || possibleClubName.endsWith("-")) {
                // delete trailing hyphen/minus 
                possibleClubName = possibleClubName.slice(0, possibleClubName.length - 1);
                possibleClubName = possibleClubName.trim();
            }
            for (let opponentNameEl of fixtureOpponentNameElements) {
                if (opponentNameEl.innerText.trim() == possibleClubName) {
                    let trow = opponentNameEl.parentElement.parentElement;
                    let contactManagerLinks = trow.getElementsByClassName('contact-manager-link');
                    if (contactManagerLinks.length > 0) {
                        let contactManagerLink = contactManagerLinks[0];
						let mentionId = link.getAttribute("mention_id");
						let href = link.getAttribute("href");
						
                        let vkId = mentionId 
							// a "VK mention" of the manager
							? mentionId.replace("id", "")
							// a plain old link to the manager's page
							: (href.indexOf("https://vk.com/id") > -1)
								? href.replace("https://vk.com/id", "")
								: null;
						
						contactManagerLink.href = vkId 
							// found VK ID, can create link to direct messages
							? "https://vk.com/write" + vkId
							// manager home page
							: href;
							
                        contactManagerLink.classList.remove("disabled");
                    }
                }
            }
        } catch (e) {
            // quite possible that it's not actually a club name, so do nothing
        }
    }
    
    loadState.managerContactsUpdated = true;
    return Promise.resolve(true);//Promise.resolve(managerList);
}

function setUpManagersInfo() {
    fetch(managerListUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            // VK returnes pages encoded in windows-1251
            let decoder = new TextDecoder("windows-1251");
            let text = decoder.decode(buffer);
            return Promise.resolve(text);
        })
        .then(applyManagerPageData)
        .catch(function (error) {
            console.error(error);
            console.trace();
            loadState.managerContactsUpdated = true; // not a critical feature, so we report loading as finished regardless of the outcome
        });
}

function setUpNearestFixtures(teamId, leagueId) {
    let teamCalendarUrl = lmo.getTeamCalendarUrl(leagueId, teamId);
    document.querySelector('.nearest-fixtures-table tbody')
        .innerHTML = ''; // remove all current data

    fetch(teamCalendarUrl)
        .then(response => response.text())
        .then(parseTeamCalendarPage)
        .then(applyFixturesInfo)
        .catch(function (error) {
            console.trace();
            console.error(error);
        });
}


/* END NEAREST FIXTURES SNIPPET */

/* LEAGUE AND CLUB SELECTION */
function setUpClubSelector() {
    /* League selection */
    leagueSelector.innerHTML = '';
    let noLeagueOption = document.createElement('option');
    noLeagueOption.value = "";
    noLeagueOption.setAttribute("disabled", "disabled");
    noLeagueOption.setAttribute("selected", "selected");
    noLeagueOption.innerText = "...";
    leagueSelector.appendChild(noLeagueOption);

    for (let currentLeagueIdx in league) {
        /* Create selectable option for each league */
        let option = document.createElement('option');
        let leagueId = league[currentLeagueIdx];
        
        option.value = leagueId;
        option.innerText = leagueNames[leagueId];
        leagueSelector.appendChild(option);

        /* Fetch and fill clubs list for each league */
        let clubsListUrl = lmo.getLeagueRosterUrl(leagueId);
        fetch(clubsListUrl)
            .then(response => response.text())
            .then(function (content) {
                let htmlDoc = parser.parseFromString(content, 'text/html');
                let rows = htmlDoc.querySelectorAll('.lmoMenu tr');
                for (let row of rows) {
                    let teamName = row.children[0].children[0].title.replace("The Match Schedule from ", "").trim();
                    let teamLinkQueryStringExpendablePart = `?action=program&file=${leagueId}&selteam=`;
                    let teamId = row.children[0].children[0].children[0].search.replace(teamLinkQueryStringExpendablePart, "").trim();
                    let currentTeamLogoUrl = row.getElementsByTagName('img')[0].src;
                    let teamInfo = {
                        teamId: teamId,
                        teamName: teamName,
                        teamLogoUrl: currentTeamLogoUrl
                    };
                    teamsByLeague[leagueId].push(teamInfo);
                }
                // global teamsByLeague
                teamsByLeague[leagueId] = teamsByLeague[leagueId]
                    .sort(function (a, b) { return a.teamName < b.teamName ? -1 : a.teamName > b.teamName ? 1 : 0 });
                
                Promise.resolve(true);
            })
            .catch(function (error) {
                console.trace();
                console.error(error);
            });
    }

    leagueSelector.addEventListener("change", function (event) {
        globalData.setCurrentLeague(this.value);
        // todo sync up
        let teams = teamsByLeague[currentLeague];

        document.getElementsByClassName('club-selection-container')[0].show();

        clubSelector.innerHTML = "";
        for (let team of teams) {
            let option = document.createElement('option');
            option.value = team.teamId;
            option.innerText = team.teamName;
            clubSelector.appendChild(option);
        }
    });
}
/* END LEAGUE AND CLUB SELECTION */

/* EVENT HANDLERS */
function setUpEventHandlers() {
    document.getElementsByClassName('nearest-fixtures-header')[0].addEventListener("click", function (event) {
        let isFullCalendar = this.className.indexOf("full-calendar") > -1;
        let headerText = document.getElementsByClassName("nearest-fixtures-header-text")[0];
        let nearestFixturesTable = document.getElementsByClassName("nearest-fixtures-table")[0];
        let allFixturesTable = document.getElementsByClassName("full-calendar-table")[0];
        if (isFullCalendar) {
            // toggle nearest fixtures
            this.className = this.className.replace("full-calendar", "");
            headerText.innerText = "Ближайшие матчи";
            headerText.title = "Переключиться на календарь";
            nearestFixturesTable.show();
            allFixturesTable.hide();
        } else {
            // toggle full calendar
            this.className += " full-calendar";
            headerText.innerText = "Календарь";
            headerText.title = "Переключиться на ближайшие матчи";
            nearestFixturesTable.hide();
            allFixturesTable.show();
        }
    });
    
    document.getElementById('club-confirmation').addEventListener("click", function (event) {
        if (leagueSelector.value && clubSelector.value > 0) {
            globalData.setCurrentTeamId(clubSelector.value);
            let teams = teamsByLeague[currentLeague];
            let currentTeamInfo = teams.filter(t => t.teamId == currentTeamId)[0];
            globalData.setCurrentTeam(currentTeamInfo.teamName);
            globalData.setCurrentTeamLogourl(currentTeamInfo.teamLogoUrl);

            setUpGlobal();
            toggleSelectedClubState();

            loadState.headerUpdated = true;
        }
    });

    document.getElementById('change-club-btn').addEventListener("click", function (event) {
        toggleNoActiveClubState();
    });

    document.getElementById('reset-btn').addEventListener("click", function (event) {
        globalData.setCurrentTeam(null);
        globalData.setCurrentLeague(null);
        globalData.setCurrentTeamId(null);
        globalData.setCurrentTeamLogourl(null);
        location.reload();
    });
}
/* END EVENT HANDLERS */

/* PAGE STATE */
function hideEverything() {
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    document.getElementsByTagName('body')[0].hide(false); // hide everything
}

function showEverything() {
    document.getElementsByTagName('html')[0].style.overflow = "visible";
    document.getElementsByTagName('body')[0].show(false); // show everything
}

function hideDynamicSections() {
    //document.getElementsByTagName('html')[0].style.overflow = "hidden";
    let sectionsToToggleVisibilityFor = document.querySelectorAll('section:not(.error-section):not(.links-container):not(.league-and-club-selection-container)');
    for (let section of sectionsToToggleVisibilityFor)
    {
        section.hide(false);
    }
}

function showDynamicSections() {
    //document.getElementsByTagName('html')[0].style.overflow = "visible";
    let sectionsToToggleVisibilityFor = document.querySelectorAll('section:not(.error-section):not(.links-container):not(.league-and-club-selection-container)');
    for (let section of sectionsToToggleVisibilityFor)
    {
        section.show(false);
    }
}

function showError() {
    document.getElementsByClassName("error-section")[0].show();
}

function hideError() {
    document.getElementsByClassName("error-section")[0].hide();
}

function toggleNoActiveClubState() {
    document.getElementsByClassName('league-and-club-selection-container')[0].show();
    document.getElementsByClassName('club-information-container')[0].hide();
    document.getElementsByClassName('fixtures-container')[0].hide();
    document.getElementsByClassName('league-snippet-container')[0].hide();
}

function toggleSelectedClubState() {
    document.getElementsByClassName('league-and-club-selection-container')[0].hide();
    document.getElementsByClassName('club-information-container')[0].show();
    document.getElementsByClassName('fixtures-container')[0].show();
    document.getElementsByClassName('league-snippet-container')[0].show();

    document.getElementsByClassName('club-name')[0].innerText = currentTeam;
    document.getElementById('header-logo').src = teamLogoUrl;
}

function updateCurrentClubState() {
    if (currentTeam != null && currentLeague != null && currentTeamId != null && teamLogoUrl != null) {
        toggleSelectedClubState();
        setUpLeagueTable(currentLeague);
        setUpNearestFixtures(currentTeamId, currentLeague);
    } else {
        // делаем вид, что всё загрузилось
        loadState.leagueTableUpdated = true;
        loadState.nearestFixturesUpdated = true;
        loadState.managerContactsUpdated = true;
        toggleNoActiveClubState();
    }
}

/* END PAGE STATE */

function setUpGlobal(initial) {

    loadState.reset();
    if (initial) {
        loadState.headerUpdated = true;
        // run these methods once
        setUpClubSelector();
        setUpEventHandlers();
    }

    hideEverything(); // prevent flickering; once loadstate tells us that everything has updated properly, we'll show everything    
    setUpLinks(currentLeague);

    updateCurrentClubState();

    let tick = 0;
    let updateCompleted = false;
    let maxUpdateCompletionChecks = 70;
    let updateCompletionCheckInterval = 100; // timeout = maxUpdateCompletionChecks * updateCompletionCheckInterval = 7 seconds; LMO sometimes responds slowly
    function scheduleUpdateCompletionCheck() {
        setTimeout(function () {
            if (updateCompleted) {
                return;
            }

            if (loadState.allComponentsLoaded()) {
                updateCompleted = true;
                showDynamicSections();
                updateCurrentClubState();
                showEverything();
                hideError();
            } else if (tick < maxUpdateCompletionChecks) {
                tick++;
                scheduleUpdateCompletionCheck();
            } else {
                showEverything();
                hideDynamicSections();
                showError();
                //document.getElementsByTagName('body')[0].innerHTML = "Ошибка загрузки расширения. Для корректной работы требуются подключение к интернету и доступность страницы " + lmo.baseUrl;                
            }
        }, updateCompletionCheckInterval);
        tick++;
    }
    scheduleUpdateCompletionCheck();    
}


function initializeFromSync(callback) {
    chrome.storage.sync.get(null, function (storage) {
		let isActiveLeague = false;
		for (let i in league) {			
			if (storage.currentLeague === league[i])
				isActiveLeague = true;
		}
		if (isActiveLeague) {
			// only initialize from storage.sync if the data is still relevant
			currentLeague = storage.currentLeague;
			currentTeam = storage.currentTeam;
			currentTeamId = storage.currentTeamId;
			teamLogoUrl = storage.teamLogoUrl;
		} 
        callback();
    })
}

initializeFromSync(function () {
    setUpGlobal(true);
});