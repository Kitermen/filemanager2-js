let pom = 0
let tab = [
    {
        tlo: "lightgrey",
        text: "red"
    },
    {
        tlo: "black",
        text: "green"

    },
    {
        tlo: "white",
        text: "pink"
    }
]
let pom2 = 0
let edytor = window.document.getElementById("edytor")
let numery = window.document.getElementById("numery")
linie()
settings()
edytor.oninput = function () {
    linie()
}
edytor.onscroll = function () {
    numery.scroll({
        top: edytor.scrollTop
    })
}
function linie() {
    numery.innerHTML = ""
    let linia = edytor.value.split("\n")
    for (let i = 1; i <= linia.length; i++) {
        numery.innerHTML += i + "<br>"
    }
}
let przycisk1 = window.document.getElementById("btn1")
przycisk1.onclick = function () {
    pom += 1
    edytor.style.fontSize = pom + "px"
    numery.style.fontSize = pom + "px"

}
let przycisk2 = window.document.getElementById("btn2")
przycisk2.onclick = function () {
    pom -= 1
    edytor.style.fontSize = pom + "px"
    numery.style.fontSize = pom + "px"

}
let przycisk3 = window.document.getElementById("btn3")
przycisk3.onclick = function () {
    pom2 += 1
    if (pom2 >= tab.length) {
        pom2 = 0
    }
    edytor.style.color = tab[pom2].text
    edytor.style.background = tab[pom2].tlo

}
let przycisk4 = window.document.getElementById("btn4")
przycisk4.onclick = function () {
    const headers = {
        "content-type": "text/plain",
    }
    const body = {
        pom: pom,
        pom2: pom2
    }

    fetch("/zapisz", {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
    }).then((response) => response.text())
        .then(() => {
            window.alert("zmiany zostały zapisane")
        })
}
let rename2 = window.document.getElementById("rename2")
let przycisk5 = window.document.getElementById("btn5")
przycisk5.onclick = function () {

    rename2.showModal()
}
let can4 = window.document.getElementById("can4")
can4.onclick = function () {
    rename2.close()
}

function settings() {
    fetch("/set", {
        method: "POST"
    }).then((response) => response.json())
        .then((daneserwera) => {
            pom = daneserwera.pom
            pom2 = daneserwera.pom2
            edytor.style.fontSize = pom + "px"
            numery.style.fontSize = pom + "px"
            edytor.style.color = tab[pom2].text
            edytor.style.background = tab[pom2].tlo
        })
}
