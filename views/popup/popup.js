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

var parser = new DOMParser();

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
    /* Data structure for nearest fixtures */
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
    let fixturesDelta = 3; // отображаемое количество сыгранных туров,
    let concludedFixtures = fixtures
        .filter(f => f.concluded)
        .sort(f => f.fixtureId);

    let recentlyConcludedFixtures = concludedFixtures
        .slice(concludedFixtures.length - fixturesDelta, concludedFixtures.length);
    let upcomingFixtures = fixtures
        .filter(f => !f.concluded)
        .sort(f => f.fixtureId)
        .slice(0, fixturesDelta);

    let snippetFixtures = [];
    snippetFixtures = snippetFixtures.concat(recentlyConcludedFixtures);
    snippetFixtures = snippetFixtures.concat(upcomingFixtures);

    let fixturesContainer = document.querySelector('.nearest-fixtures-table tbody');
    fixturesContainer.innerHTML = ''; // remove all current data

    //let headerRow = document.createElement('th');
    //let fixtureHeaderTd = document.createElement('td');
    //fixtureHeaderTd.innerText = "Тур";
    //let homeAwayHeaderTd = document.createElement('td');
    //homeAwayHeaderTd.innerText = "Д";
    //let opponentLogoHeaderTd = document.createElement('td');
    
    //let opponentTeamHeaderTd = document.createElement('td');
    //opponentTeamHeaderTd.innerText = "Соперник";
    //let outcomeHeaderTd = document.createElement('td');

    //let opponentButtonHeaderTd = document.createElement('td');

    for (let fixture of snippetFixtures) {
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
        fixtureNumberSpan.innerText = "Tur " + fixture.fixtureId;
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
        //    contactManagerBtn.title = "Написать тренеру";
        //    buttonTd.appendChild(contactManagerBtn);
        //}
        //row.appendChild(buttonTd);

        fixturesContainer.appendChild(row);
    }

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
    let leagueSelector = document.getElementById('league-selector');
    let clubSelector = document.getElementById('club-selector');

    /* League selection */
    leagueSelector.innerHTML = '';
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
                    let teamLogoUrl = row.getElementsByTagName('img')[0].src;
                    let teamInfo = {
                        teamId: teamId,
                        teamName: teamName,
                        teamLogoUrl: teamLogoUrl
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
        currentLeague = this.value;
        // todo sync up
        let teams = teamsByLeague[currentLeague];
        clubSelector.innerHTML = "";
        for (let team of teams) {
            let option = document.createElement('option');
            option.value = team.teamId;
            option.innerText = team.teamName;
            clubSelector.appendChild(option);
        }
    });

    /* Club selection */
    clubSelector.addEventListener("change", function (event) {
        currentTeamId = this.value;
        
        let teams = teamsByLeague[currentLeague];
        let currentTeamInfo = teams.filter(t => t.teamId == currentTeamId)[0];
        currentTeam = currentTeamInfo.teamName;        
        teamLogoUrl = currentTeamInfo.teamLogoUrl;

        document.getElementsByClassName('club-name')[0].innerText = currentTeam;
        document.getElementById('header-logo').src = teamLogoUrl;
        console.log(teamsByLeague);
        setUpGlobal();
        // todo sync up
    });

    //for (let league of )
    //let clubsListUrl = lmo.getLeagueTableUrl(leagueId);
    //fetch(clubsListUrl)
    //    .then(response => response.text())
    //    .then()

    //function getClubsList(leagueTablePage) {

    //}
}
setUpClubSelector();
/* END LEAGUE AND CLUB SELECTION */


function setUpGlobal() {
    setUpLinks(currentLeague);
    setUpLeagueTable(currentLeague);
    setUpNearestFixtures(currentTeamId, currentLeague);
}
setUpGlobal();