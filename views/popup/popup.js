let lmo = {
    baseUrl: "http://lmo.online.gamma.mtw.ru/lmo.php",
    getLeagueTableUrl: function(leagueId) {
        return `${lmo.baseUrl}?todo=&file=${leagueId}`;
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

function setUpLinks(teamId, leagueId) {
    document.getElementById("lmo-link").setAttribute("href", lmo.baseUrl);
    let coachListUrl = coachListLinks[leagueId];
    document.getElementById("coaches-list-link").setAttribute("href", coachListUrl);
    document.getElementById("rules-link").setAttribute("href", rulesUrl);
    document.getElementById("faq-link").setAttribute("href", faqUrl);
    let reportMatchUrl = matchTopicLinks[leagueId];
    document.getElementById("report-match-link").setAttribute("href", reportMatchUrl);
    let tournamentTableUrl = lmo.getLeagueTableUrl(leagueId);
    document.getElementById("tournament-table-link").setAttribute("href", tournamentTableUrl);
}

let currentLeague = league.SerieA;
let currentTeam = "Cagliari Calcio";
setUpLinks(currentTeam, currentLeague);