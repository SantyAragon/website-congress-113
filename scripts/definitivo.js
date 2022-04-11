let chamber = document.querySelector("#table-senate") ? "senate" : "house"
let UrlAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "ayEQKIOE9pPw2ACZf9laT7NHVztG9hZ5no8SiYsr"
    }
}
// CAPTURO LOADING Y BODY
let loading = document.querySelector("#loader-container")
let body = document.querySelector("body");
let allMembers = [];

fetch(UrlAPI, init)
    .then(response => response.json())
    .then(contenidoDeJson => {
        getMembers(contenidoDeJson.results[0].members);
        if (body.classList.contains("senate") || body.classList.contains("house")) {
            renderSelect(estadosOrdenados(allMembers));
            renderNames(allMembers);
        } else {
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
                renderGlanceTable(allDemocrates, "Democrats", totalPercentageDem);
                renderGlanceTable(allRepublicans, "Republican", totalPercentageRep);
                renderGlanceTable(allIndependents, "Independents", totalPercentageInd);
                renderFootTable(allMembers, totalPercentage);

                renderTablesAttendance(orderPer(allMembersWithVotes, "missed_votes_pct").slice(0, tenPercentage), "least-table")
                renderTablesAttendance(orderPer(allMembersWithVotes, "missed_votes_pct").reverse().slice(0, tenPercentage), "most-table")

            } else if (body.classList.contains("party-loyalty")) {
                renderGlanceTable(allDemocrates, "Democrats", totalPercentageDem)
                renderGlanceTable(allRepublicans, "Republican", totalPercentageRep)
                renderGlanceTable(allIndependents, "Independents", totalPercentageInd)
                renderFootTable(allMembers, totalPercentage)

                renderTablesLoyalty(orderPer(allMembersWithVotes, "votes_with_party_pct").reverse().slice(0, tenPercentage), "least-table");
                renderTablesLoyalty(orderPer(allMembersWithVotes, "votes_with_party_pct").slice(0, tenPercentage), "most-table");
            }
        }
        loading.classList.add("loader-desactive");
    })
    .catch(error => console.warn(error.message))

//FUNCION QUE RETORNA UN ARRAY DE ESTADOS ORDENADOS Y SIN REPETIR
const estadosOrdenados = (array) => {
    let estadosFiltrados = [];
    array.forEach(member => {
        if (!estadosFiltrados.includes(member.state)) {
            estadosFiltrados.push(member.state);
        }
    })
    return estadosFiltrados.sort()
}

// FUNCION PARA RENDERIZAR TODOS LOS ESTADOS
function renderSelect(array) {
    const select = document.querySelector("select[name='states']")
    array.forEach(state => {
        let options = document.createElement("option")
        options.innerHTML = `${state}`
        options.value = `${state}`

        select.appendChild(options)
    })
}


//FUNCION PARA LLENAR ARRAY CON MIEMBROS RECIBIDOS DE API
const getMembers = array => array.forEach(member => allMembers.push(member))

//FUNCION PARA FILTRAR POR ESTADO Y PARTIDO UN ARRAY DE MIEMBROS
const showForParty = (array, partido) => array.filter(element => element.party === partido)
const showForState = (array, estado) => array.filter(element => element.state === estado)

// FUNCION PARA DIBUJAR LA TABLA RECIBIENDO UN ARRAY DE MIEMBROS
const renderNames = (array) => {
    const listCompleteMembers = document.querySelector("#members-politician")
    listCompleteMembers.innerHTML = ""
    array.forEach((member) => {
        let listMember = document.createElement("tr")

        listMember.innerHTML = `<td><a href="https://www.${member.last_name}${member.first_name}.com">
        ${member.last_name}
                ${member.middle_name ? member.middle_name : " "} 
                ${member.first_name} </a></td>
                <td> ${member.party} </td>
                <td> ${member.state} </td>
                <td> ${member.seniority} years</td>
                <td> ${member.votes_with_party_pct} %</td>
                `
        listCompleteMembers.appendChild(listMember)
    })
}
// FUNCION PARA DIBUJAR LAS TABLAS DE GLANCE EN TODAS LAS VISTAS
function renderGlanceTable(array, name, totalPercentage) {
    let table = document.querySelector(`#glance-table`)
    let createdRow = document.createElement("tr")
    createdRow.innerHTML = `
    <td>${name}</td>
    <td>${array.length}</td>
    <td>${totalPercentage.toFixed(2)} &#37;</td>`
    table.appendChild(createdRow);
};
//FUNCION PARA DIBUJAR PIE DE TABLAS GLANCE EN TODAS LA VISTAS
const renderFootTable = (array, totalPercentage) => {
    let tfoot = document.querySelector("#glance-tfoot")
    tfoot.innerHTML = `
    <td>Total</td>
    <td>${array.length}</td>
    <td>${totalPercentage.toFixed(2)} &#37;</td>`
};

// FUNCION PARA ORDENAR DESCENDENTE POR DETERMINADO CRITERIO/PROPIEDAD
const orderPer = (array, propierty) => {
    return array.sort((a, b) => {
        return b[propierty] - a[propierty]
    })
};

// FUNCION PARA DIBUJAR TABLAS DE ATTENDANCE
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

// FUNCION PARA DIBUJAR TABLAS DE PARTY-LOYALTY

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

//FUNCION PARA FILTRAR LOS MIEMBROS POR ESTADO
function filtrarPorEstado(array, condition) {
    let filtradosPorEstado = [];
    if (condition === "all") {
        filtradosPorEstado = array
    } else {
        filtradosPorEstado = array.filter(member => member.state == condition)
    }
    return filtradosPorEstado
}

if (body.classList.contains("senate") || body.classList.contains("house")) {
    const form = document.querySelector("form")
    const select = form.querySelector("select[name='states']")
    form.addEventListener("change", actualizarForm)

    function actualizarForm() {
        let checkboxes = form.querySelectorAll("input[type='checkbox']")
        let arrayCheckboxes = Array.from(checkboxes)
        let checkboxesSeleccionados = arrayCheckboxes.filter(checkbox => checkbox.checked)
        let allChecks = checkboxesSeleccionados.map(checkbox => checkbox.value)
        let opcionSeleccionada = select.value;

        const filtrarPartidos = (array) => {

            if (allChecks.length === 0) {
                renderNames(array)
            } else {
                let aux = [];
                array.forEach(miembro =>
                    allChecks.forEach(check => miembro.party == check ? aux.push(miembro) : ""))
                renderNames(aux)
            }
        }
        filtrarPartidos(filtrarPorEstado(allMembers, opcionSeleccionada));
    }
}