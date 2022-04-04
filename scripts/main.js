const imprimirNombres = (data) => data.results[0].members.forEach(element =>
    console.table(`${element.first_name} ${element.last_name}`));

// imprimirNombres(data)

//EJERCICIO C

// var aux2 = senateData.results[0].members.map(element => element.state);
// let aux2 = [];
// console.log(aux2);
// const imprimirEstados = (senateData) => senateData.results[0].members.filter(element => (!aux2.includes(element.state)))


// imprimirEstados(data);


const estadosOrdenados = (senateData) => {
    let estadosFiltrados = [];
    senateData.results[0].members.forEach(element => {
        if (!estadosFiltrados.includes(element.state)) {
            estadosFiltrados.push(element.state);
        }
    })
    return estadosFiltrados.sort()
}

// console.log(estadosOrdenados(data))

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

        listMember.innerHTML = ` <td><a href="https://www.${member.last_name}${member.first_name}.com">
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
renderSelect(estadosOrdenados(data))

function filtrarPorEstado(array, condition) {
    let filtradosPorEstado = [];
    if (condition === "all") {
        filtradosPorEstado = array.results[0].members
    } else {
        filtradosPorEstado = array.results[0].members.filter(member => member.state == condition)
    }
    return filtradosPorEstado
}

form.addEventListener("change", () => {

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
})

renderNames(data.results[0].members);