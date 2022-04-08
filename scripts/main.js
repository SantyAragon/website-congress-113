let chamber = document.querySelector("#table-senate") ? "senate" : "house"
let UrlAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "ayEQKIOE9pPw2ACZf9laT7NHVztG9hZ5no8SiYsr"
    }
}

let loading = document.querySelector("#loader-container")

let data = []
fetch(UrlAPI, init)
    .then(response => response.json())
    .then(contenidoDeJson => {
        data = contenidoDeJson.results[0].members
        renderSelect(estadosOrdenados(data));
        renderNames(data);
        loading.classList.add("loader-desactive");

    })
    .catch(error => console.warn(error.message))

// imprimirNombres(data)

const estadosOrdenados = (senateData) => {
    let estadosFiltrados = [];
    senateData.forEach(element => {
        if (!estadosFiltrados.includes(element.state)) {
            estadosFiltrados.push(element.state);
        }
    })
    return estadosFiltrados.sort()
}

// EJERCICIO D
const showForParty = (array, partido) => array.results[0].members.filter(element => element.party === partido)
    .map(element => element.first_name + " " + element.last_name)

// console.table(showForParty(data, "R").sort());

// EJERCICIO E
const showForState = (array, estado) => array.results[0].members.filter(element => element.state === estado).map(element =>
    element.first_name + " " + element.last_name)

// console.table(showForState(data, "TN").sort());


const form = document.querySelector("form")
const select = form.querySelector("select[name='states']")



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

function renderSelect(array) {
    array.forEach(state => {
        let options = document.createElement("option")
        options.innerHTML = `${state}`
        options.value = `${state}`

        select.appendChild(options)
    })
}
// renderSelect(estadosOrdenados(data));

function filtrarPorEstado(array, condition) {
    let filtradosPorEstado = [];
    if (condition === "all") {
        filtradosPorEstado = array
    } else {
        filtradosPorEstado = array.filter(member => member.state == condition)
    }
    return filtradosPorEstado
}

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
    filtrarPartidos(filtrarPorEstado(data, opcionSeleccionada));
}