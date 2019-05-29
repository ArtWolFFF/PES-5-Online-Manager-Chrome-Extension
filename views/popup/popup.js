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
    SerieA: "seriea.l98",
    Ligue1: "ligue1.l98",
    LaLiga: "example.l98",
    EuroLeague: "euroleague.l98",
    EPL: "epl.l98",
    Bundesliga: "bundesliga.l98"
};

let teamsByLeague = {
};
teamsByLeague[league.SerieA] = [];
teamsByLeague[league.Ligue1] = [];
teamsByLeague[league.LaLiga] = [];
teamsByLeague[league.EuroLeague] = [];
teamsByLeague[league.EPL] = [];
teamsByLeague[league.Bundesliga] = [];

let currentLeague = league.SerieA;
let currentTeam = "Cagliari Calcio";
let currentTeamId = "8";
let teamLogoUrl = "http://lmo.online.gamma.mtw.ru/img/teams/small/Cagliari%20Calcio.png";

globalData = {
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
    reset: function () {
        loadState.headerUpdated = false;
        loadState.nearestFixturesUpdated = false;
        loadState.leagueTableUpdated = false;
        loadState.linksUpdated = false;
    },
    allComponentsLoaded: function () {
        return loadState.headerUpdated
            && loadState.nearestFixturesUpdated
            && loadState.leagueTableUpdated
            && loadState.linksUpdated;
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
/* END UTILS */

/* LINKS */
let matchTopicLinks = {};
matchTopicLinks[league.SerieA] = "https://vk.com/topic-54185875_40077151";
matchTopicLinks[league.Ligue1] = "https://vk.com/topic-54185875_40077984";
matchTopicLinks[league.LaLiga] = "https://vk.com/topic-54185875_40077917";
matchTopicLinks[league.EuroLeague] = "https://vk.com/topic-54185875_40079447";
matchTopicLinks[league.EPL] = "https://vk.com/topic-54185875_40077880";
matchTopicLinks[league.Bundesliga] = "https://vk.com/topic-54185875_40075989";

let coachListLinks = {};
coachListLinks[league.SerieA] = "https://vk.com/topic-54185875_37150957?post=87359";
coachListLinks[league.Ligue1] = "https://vk.com/topic-54185875_37150957?post=87362";
coachListLinks[league.LaLiga] = "https://vk.com/topic-54185875_37150957?post=87358";
coachListLinks[league.EuroLeague] = "https://vk.com/topic-54185875_37150957?post=87363";
coachListLinks[league.EPL] = "https://vk.com/topic-54185875_37150957?post=87357";
coachListLinks[league.Bundesliga] = "https://vk.com/topic-54185875_37150957?post=87360";

let rulesUrl = "https://vk.com/wel9_online?w=page-54185875_44626803";
let faqUrl = "https://vk.com/wel9_online?w=page-54185875_49853606";

function setUpLinks(leagueId) {
    document.getElementById("lmo-link").setAttribute("href", lmo.baseUrl);
    let coachListUrl = coachListLinks[leagueId];
    document.getElementById("coaches-list-link").setAttribute("href", coachListUrl);
    document.getElementById("rules-link").setAttribute("href", rulesUrl);
    document.getElementById("faq-link").setAttribute("href", faqUrl);
    let reportMatchUrl = matchTopicLinks[leagueId];
    document.getElementById("report-match-link").setAttribute("href", reportMatchUrl);
    let leagueTableUrl = lmo.getLeagueTableUrl(leagueId);
    document.getElementById("tournament-table-link").setAttribute("href", leagueTableUrl);

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
    let snippetDelta = 3; // ���������� ������ ���� � ���� ��������� �������, ������� ������������ � �������� �������
    let snippetStartIdx = Math.max(1, currentTeamPosition - snippetDelta);
    let snippetEndIdx = Math.min(teamsInLeague, currentTeamPosition + snippetDelta);

    let leagueTableContainer = document.querySelector('.tournament-table tbody');
    leagueTableContainer.innerHTML = '<tr class="league-table-header-row"><td></td><td></td><td></td><td class="table-games-cell"><span class="table-games unobtrusive-header">\u0418</span></td><td><span class="table-points unobtrusive-header">\u041E</span></td></tr>';

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
        let isPlayed = row.children[6].innerText != "_";
        let fixture = {
            fixtureId: parseInt(row.children[0].innerText.trim()),
            homeTeam: row.children[2].innerText.trim(),
            homeTeamLogoUrl: row.children[2].getElementsByTagName('img')[0].src,
            awayTeam: row.children[4].innerText.trim(),
            awayTeamLogoUrl: row.children[4].getElementsByTagName('img')[0].src,
            homeTeamGoals: isPlayed ? parseInt(row.children[6].innerText) : 0,
            awayTeamGoals: isPlayed ? parseInt(row.children[8].innerText) : 0,
            concluded: isPlayed
        };

        fixtures.push(fixture);
    }

    return Promise.resolve(fixtures);
}

function applyNearestFixturesInfo(fixtures) {
    allFixtures = fixtures; // saving globally for later use

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
    return applyFixtures(snippetFixtures);
}

function applyFixtures(fixtures) {
    let fixturesContainer = document.querySelector('.nearest-fixtures-table tbody');
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
            ? "win"
            : myGoals < opponentGoals ? "loss" : "draw";

        let row = document.createElement('tr');

        let fixtureNumberTd = document.createElement('td');
        fixtureNumberTd.className = "fixture-number-cell";
        let fixtureNumberSpan = document.createElement('div');
        fixtureNumberSpan.className = "fixture-number";
        fixtureNumberSpan.innerText = "\u0422\u0443\u0440 " + fixture.fixtureId;
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
        outcomeSpan.innerText = `${myGoals}:${opponentGoals}`;
        outcomeTd.appendChild(outcomeSpan);
        row.appendChild(outcomeTd);

        let homeAwayTd = document.createElement('td');
        let homeAwaySpan = document.createElement('div');
        homeAwaySpan.className = "home-away";
        homeAwaySpan.innerHTML = isHomeMatch ? "(\u0434)" : "(\u0433)";
        homeAwayTd.appendChild(homeAwaySpan);
        row.appendChild(homeAwayTd);

    //let buttonTd = document.createElement('td');
    //if (!fixture.concluded) {
    //    let contactManagerBtn = document.createElement('a');
    //    contactManagerBtn.className = "contact-manager-link";
    //    contactManagerBtn.target = "_blank";
    //    contactManagerBtn.href = "https://vk.com/omgfuuuck";
    //    contactManagerBtn.title = "�������� �������";
    //    buttonTd.appendChild(contactManagerBtn);
    //}
    //row.appendChild(buttonTd);

        fixturesContainer.appendChild(row);
    }

    loadState.nearestFixturesUpdated = true;
    return true;
}

function setUpNearestFixtures(teamId, leagueId) {
    let teamCalendarUrl = lmo.getTeamCalendarUrl(leagueId, teamId);
    teamCalendarUrl.innerHTML = ''; // remove all current data

    fetch(teamCalendarUrl)
        .then(response => response.text())
        .then(parseTeamCalendarPage)
        .then(applyNearestFixturesInfo)
        .catch(function (error) {
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
        option.innerText = currentLeagueIdx;
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
                // fill teamsByLeague
                teamsByLeague[leagueId] = teamsByLeague[leagueId].sort((t) => t.teamName);
                
                Promise.resolve(true);
            })
            .catch(function (error) {
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
        if (isFullCalendar) {
            // toggle nearest fixtures
            this.className = this.className.replace("full-calendar", "");
            headerText.innerText = "\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u043C\u0430\u0442\u0447\u0438";
            headerText.title = "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043D\u0430 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C";
            applyFixtures(nearestFixtures);
        } else {
            // toggle full calendar
            this.className += " full-calendar";
            headerText.innerText = "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C";
            headerText.title = "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043D\u0430 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u043C\u0430\u0442\u0447\u0438";
            applyFixtures(allFixtures);
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
        //globalData.setCurrentTeam(null);
        //globalData.setCurrentLeague(null);
        //globalData.setCurrentTeamId(null);
        //globalData.setCurrentLogoUrl(null);
    });
}
/* END EVENT HANDLERS */

function hideEverything() {
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    document.getElementsByTagName('body')[0].hide(false); // hide everything
}

function showEverything() {
    document.getElementsByTagName('html')[0].style.overflow = "visible";
    document.getElementsByTagName('body')[0].show(false); // show everything
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

function setUpGlobal(initial) {

    loadState.reset();
    if (initial) {
        loadState.headerUpdated = true;
        // run these methods once
        setUpClubSelector();
        setUpEventHandlers();
    }

    if (currentTeam != null && currentLeague != null) {
        toggleSelectedClubState();
    } else {
        toggleNoActiveClubState();
    }

    hideEverything(); // prevent flickering; once loadstate tells us that everything has updated properly, we'll show everything
    setUpLinks(currentLeague);
    setUpLeagueTable(currentLeague);
    setUpNearestFixtures(currentTeamId, currentLeague);

    let tick = 0;
    let updateCompleted = false;
    let maxUpdateCompletionChecks = 100;
    let updateCompletionCheckInterval = 40;
    function scheduleUpdateCompletionCheck() {
        setTimeout(function () {
            if (updateCompleted) {
                return;
            }

            if (loadState.allComponentsLoaded()) {
                updateCompleted = true;
                showEverything();
            } else if (tick < maxUpdateCompletionChecks) {
                tick++;
                scheduleUpdateCompletionCheck();
            } else {
                document.getElementsByTagName('body')[0].innerHTML = "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u044F. \u0414\u043B\u044F \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0442\u0440\u0435\u0431\u0443\u044E\u0442\u0441\u044F \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443 \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B " + lmo.baseUrl;
                showEverything();
            }
        }, updateCompletionCheckInterval);
        tick++;
    }
    scheduleUpdateCompletionCheck();    
}


function initializeFromSync(callback) {
    chrome.storage.sync.get(null, function (storage) {
        currentLeague = storage.currentLeague;
        currentTeam = storage.currentTeam;
        currentTeamId = storage.currentTeamId;
        teamLogoUrl = storage.teamLogoUrl;
        callback();
    })
}

initializeFromSync(function () {
    setUpGlobal(true);
});