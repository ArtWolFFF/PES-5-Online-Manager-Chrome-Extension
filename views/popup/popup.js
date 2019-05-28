let lmo = {
    baseUrl: "http://lmo.online.gamma.mtw.ru/lmo.php",
    getLeagueTableUrl: function(leagueId) {
        return `${lmo.baseUrl}?action=table&file=${leagueId}`;
    },
    getTeamCalendarUrl: function(leagueId, teamId) {
        return `${lmo.baseUrl}?action=program&file=${leagueId}&selteam=${teamId}`;
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

let currentLeague = league.SerieA;
let currentTeam = "Cagliari Calcio";
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

setUpLinks(currentLeague);
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
    document.getElementsByClassName('club-position').innerText = currentTeamPosition;
    let teamsInLeague = leagueTableInfo.standings.length;
    let snippetDelta = 3; // количество команд выше и ниже выбранной команды, которое показывается в сниппете таблицы
    let snippetStartIdx = Math.max(1, currentTeamPosition - snippetDelta);
    let snippetEndIdx = Math.min(teamsInLeague, currentTeamPosition + snippetDelta);

    let leagueTableContainer = document.querySelector('.tournament-table tbody');
    leagueTableContainer.innerHTML = ''; // remove all current data

    for (let i = snippetStartIdx; i <= snippetEndIdx; i++) {
        let team = leagueTableInfo.standings[i - 1];        
        let row = document.createElement('tr');
        
        let teamPosition = document.createElement('td');
        let teamPositionSpan = document.createElement('span');
        teamPositionSpan.innerText = team.position;
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
        teamNameTd.appendChild(teamNameSpan);
        row.appendChild(teamNameTd);

        let gamesPlayedTd = document.createElement('td');
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
setUpLeagueTable(currentLeague);
/* END LEAGUE TABLE SNIPPET */



/* NEAREST FIXTURES SNIPPET */
function applyNearestFixturesInfo(nearestFixtures) {
    let fixturesContainer = document.querySelector('.nearest-fixtures-table tbody');
    fixturesContainer.innerHTML = ''; // remove all current data
    //for (let i = snippetStartIdx; i <= snippetEndIdx; i++) {
    //    // TODO sort out
    //    let team = nearestFixtures[i];
    //    let row = document.createElement('tr');
    //    let vs = document.createElement('td');
    //    vs.innerHTML("vs");
    //    row.appendChild(vs);
    //    let logoTd = document.createElement('td');
    //    let logoImg = document.createElement('img');
    //    logoImg.src = team.logoUrl;
    //    logoImg.width = 20;
    //    logoImg.height = 20;
    //    logoTd.appendChild(logoImg);
    //    row.appendChild(logoTd);

    //    
    //    fixturesContainer.appendChild(row);
    //}
}

/* END NEAREST FIXTURES SNIPPET */