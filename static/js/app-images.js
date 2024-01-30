let kanwas = window.document.getElementById("canvas");
let fileName = window.document.getElementById("file_name");
let ctx = kanwas.getContext("2d");
let showImage = window.document.getElementById("btn1");
showImage.onclick = function () {
    location = "/showImg?img=" + fileName.innerText;
}
let boolean = true
let filtersBtn = window.document.getElementById("filters_btn")
let filtersMenu = window.document.getElementById("filters_menu")
filtersBtn.addEventListener("click", ()=>{
    if (boolean == true) {
        filtersMenu.style.width = "12%";
        filtersMenu.style.borderTop = "3px solid black";
        filtersMenu.style.borderRight = "3px solid black";
        filtersMenu.style.borderBottom = "3px solid black";
        filtersMenu.style.borderTopLeftRadius = "0px";
        boolean = !boolean;
    } 
    else {
        filtersMenu.style.width = "0%";
        filtersMenu.style.border = "none";
        boolean = !boolean;
    }
})
   

let saveImg = window.document.getElementById("save_img");
saveImg.addEventListener("click", ()=>{
    kanwas.toBlob((blob) => {
        let data = new FormData();
        data.append("filePath", fileName.innerText);
        data.append("canvasImg", blob);
        console.log(blob);

        fetch("/saveImg", {
            method: "POST",
            body: data,
        }).then((response) => response.text())
            .then(() => {
                window.alert("Zmiany zostały zapisane!");
            })
    })
})


let renameDialog = window.document.getElementById("rename_dialog");
let renameBtn = window.document.getElementById("img_rename");
renameBtn.addEventListener("click", ()=>{
    renameDialog.showModal();
})


let can4 = window.document.getElementById("can4")
can4.onclick = function () {
    renameDialog.close();
}

canvas();

function canvas(filter) {
    let img = new Image()
    img.src = fileName.innerText
    img.onload = function () {
        kanwas.width = img.width
        kanwas.height = img.height

        ctx.filter = `${filter}(100%)`

        ctx.drawImage(img, 0, 0)
    }
}