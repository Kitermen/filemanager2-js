let fontSize = 14;
let colorIndex = 0;
let edytor = document.getElementById("edytor");
let lines = document.getElementById("lines");
let edytorArea = document.querySelector(".textEditor");
let colors = [
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
    },
    {
        background: "yellow",
        text: "green"
    }
];

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

let colorChg = document.getElementById("chg_clr_btn")
colorChg.addEventListener("click", () => {
    colorIndex += 1;
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
    edytor.style.color = colors[colorIndex].text;
    edytor.style.background = colors[colorIndex].background;
    lines.style.color = colors[colorIndex].text;
    lines.style.background = colors[colorIndex].background;
})


let przycisk4 = window.document.getElementById("save_to_file_btn")
przycisk4.onclick = function () {
    const headers = {
        "content-type": "text/plain",
    }
    const settings = {
        fontSize,
        colorIndex,

    }

    fetch("/saveLayout", {
        method: "POST",
        body: JSON.stringify(settings),
        headers: headers
    }).then((response) => response.text())
        .then(() => {
            window.alert("Zmiany zostały zapisane!");
        })
}
let renameDialog = window.document.getElementById("rename_dialog");
let renameBtn = window.document.getElementById("txt_rename");
renameBtn.addEventListener("click", ()=>{
    renameDialog.showModal();
})

let can4 = window.document.getElementById("can4");
can4.addEventListener("click", ()=>{
    renameDialog.close();
})



function settings() {
    fetch("/set", {
        method: "POST"
    }).then((response) => response.json())
        .then((receivedData) => {
            fontSize = receivedData.fontSize
            colorIndex = receivedData.colorIndex

            lines.style.fontSize = fontSize + "px"
            lines.style.color = colors[colorIndex].text
            lines.style.background = colors[colorIndex].background

            edytor.style.fontSize = fontSize + "px"
            edytor.style.color = colors[colorIndex].text
            edytor.style.background = colors[colorIndex].background
        })
}