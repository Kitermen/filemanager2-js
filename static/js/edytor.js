let fontSize = 14
let colours = [
    {
        background: "lightgrey",
        text: "darkgoldenrod"
    },
    {
        background: "black",
        text: "green"

    },
    {
        background: "white",
        text: "black"
    },
    {
        background: "blue",
        text: "red"
    }
]
let colorIndex = 0;
let edytor = document.getElementById("edytor");
let lines = document.getElementById("lines");
let edytorArea = document.querySelector(".textEditor");

linie();
settings();

edytor.oninput = function () {
    linie();
}
edytor.onscroll = function () {
    lines.scroll({
        top: edytor.scrollTop
    })
}
function linie() {
    lines.innerHTML = "";
    let linia = edytor.value.split("\n");
    for (let i = 1; i <= linia.length; i++) {
        lines.innerHTML += i + "<br>";
    }
}
let bigger = document.getElementById("bigger_btn")
bigger.addEventListener("click", () => {
    fontSize += 1;
    edytor.style.fontSize = `${fontSize}px`;
    lines.style.fontSize = `${fontSize}px`;
    if (fontSize > 28) {
        fontSize = 14;
    }
})

let smaller = document.getElementById("smaller_btn")
smaller.addEventListener("click", () => {
    fontSize -= 1;
    edytor.style.fontSize = `${fontSize}px`;
    lines.style.fontSize = `${fontSize}px`;
    if (fontSize < 8) {
        fontSize = 14;
    }
})

let przycisk3 = document.getElementById("chg_clr_btn")
przycisk3.addEventListener("click", () => {
    colorIndex += 1;
    if (colorIndex >= colours.length) {
        colorIndex = 0;
    }
    edytor.style.color = colours[colorIndex].text;
    edytor.style.background = colours[colorIndex].background;
    lines.style.color = colours[colorIndex].text;
    lines.style.background = colours[colorIndex].background;
})


let przycisk4 = window.document.getElementById("save_to_file_btn")
przycisk4.onclick = function () {
    const headers = {
        "content-type": "text/plain",
    }
    const body = {
        fontSize,
        colorIndex,

    }

    fetch("/zapisz", {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
    }).then((response) => response.text())
        .then(() => {
            window.alert("Zmiany zostały zapisane!")
        })
}
let rename2 = window.document.getElementById("rename")
let przycisk5 = window.document.getElementById("chg_name_btn")
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
        .then((receivedData) => {
            fontSize = receivedData.fontSize
            colorIndex = receivedData.colorIndex

            lines.style.fontSize = fontSize + "px"
            lines.style.color = colours[colorIndex].text
            lines.style.background = colours[colorIndex].background

            edytor.style.fontSize = fontSize + "px"
            edytor.style.color = colours[colorIndex].text
            edytor.style.background = colours[colorIndex].background
        })
}