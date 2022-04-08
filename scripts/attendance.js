let chamber = document.querySelector("#table-senate") ? "senate" : "house"
let UrlAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "ayEQKIOE9pPw2ACZf9laT7NHVztG9hZ5no8SiYsr"
    }
}
let loading = document.querySelector("#loader-container")

let allMembers = []
let body = document.querySelector("body");
fetch(UrlAPI, init)
    .then(response => response.json())
    .then(contenidoDeJson => {
        data = contenidoDeJson.results[0].members
        getMembers(data);

        let allDemocrates = showForParty(allMembers, "D");
        let allRepublicans = showForParty(allMembers, "R");
        let allIndependents = showForParty(allMembers, "ID");

        let allMembersWithVotes = allMembers.filter(member => member.total_votes > 0)
        let tenPercentage = Math.floor(allMembers.length * 0.1);

        let percentageD = allDemocrates.map(member => member.votes_with_party_pct).reduce((a, b) => a + b, 0);
        let percentageR = allRepublicans.map(member => member.votes_with_party_pct).reduce((a, b) => a + b, 0);
        let percentageID = allIndependents.map(member => member.votes_with_party_pct).reduce((a, b) => a + b, 0);

        let totalPercentageRep = (percentageR / allRepublicans.length);
        let totalPercentageDem = (percentageD / allDemocrates.length);
        let totalPercentageInd = (percentageID > 0) ? (percentageID / allIndependents.length) : 0;

        let totalPercentage = ((percentageD + percentageID + percentageR) / allMembers.length);


        if (body.classList.contains("attendance")) {
            renderTable(allDemocrates, "Democrats", totalPercentageDem);
            renderTable(allRepublicans, "Republican", totalPercentageRep);
            renderTable(allIndependents, "Independents", totalPercentageInd);
            renderFootTable(allMembers, totalPercentage);

            renderTablesAttendance(orderPer(allMembersWithVotes, "missed_votes_pct").slice(0, tenPercentage), "least-table")
            renderTablesAttendance(orderPer(allMembersWithVotes, "missed_votes_pct").reverse().slice(0, tenPercentage), "most-table")

        } else if (body.classList.contains("party-loyalty")) {
            renderTable(allDemocrates, "Democrats", totalPercentageDem)
            renderTable(allRepublicans, "Republican", totalPercentageRep)
            renderTable(allIndependents, "Independents", totalPercentageInd)
            renderFootTable(allMembers, totalPercentage)

            renderTablesLoyalty(orderPer(allMembersWithVotes, "votes_with_party_pct").reverse().slice(0, tenPercentage), "least-table");
            renderTablesLoyalty(orderPer(allMembersWithVotes, "votes_with_party_pct").slice(0, tenPercentage), "most-table");
        }
        loading.classList.add("loader-desactive")
    })
    .catch(error => console.warn(error.message))

//LLamado de todos los miembros y declaracion de funciones
const getMembers = array => array.forEach(member => allMembers.push(member))

const showForParty = (array, partido) => array.filter(element => element.party === partido)
const showForState = (array, estado) => array.filter(element => element.state === estado)

function renderTable(array, name, totalPercentage) {
    let table = document.querySelector(`#glance-table`)
    let createdRow = document.createElement("tr")
    createdRow.innerHTML = `
    <td>${name}</td>
    <td>${array.length}</td>
    <td>${totalPercentage.toFixed(2)} &#37;</td>`
    table.appendChild(createdRow);
};

const renderFootTable = (array, totalPercentage) => {
    let tfoot = document.querySelector("#glance-tfoot")
    tfoot.innerHTML = `
    <td>Total</td>
    <td>${array.length}</td>
    <td>${totalPercentage.toFixed(2)} &#37;</td>`
};

// DIBUJAR TABLA LEAST

const orderPer = (array, propierty) => {
    return array.sort((a, b) => {
        return b[propierty] - a[propierty]
    })
};

function renderTablesAttendance(array, id) {
    let tableLeast = document.querySelector(`#${id}`)
    array.forEach(member => {
        let tableItem = document.createElement("tr")
        tableItem.innerHTML = `
        <td><a href="${member.url} " target="_blank"> ${member.last_name} ${member.middle_name ? member.middle_name : " "} ${member.first_name}</a></td>
        <td>${member.missed_votes}</td>
        <td>${member.missed_votes_pct} &#37;</td>
        `
        tableLeast.appendChild(tableItem)
    })
};

// PARTY LOYALTY

function renderTablesLoyalty(array, id) {
    let tableLeast = document.querySelector(`#${id}`)
    array.forEach(member => {
        let votesWithParty = (member.votes_with_party_pct * member.total_votes) / 100
        let tableItem = document.createElement("tr")
        tableItem.innerHTML = `
        <td><a href="${member.url}" target="_blank">${member.last_name} ${member.middle_name ? member.middle_name : " "} ${member.first_name}</a></td>
        <td>${Math.round(votesWithParty)}</td>
        <td>${member.votes_with_party_pct} &#37;</td>
        `
        tableLeast.appendChild(tableItem);
    })
}