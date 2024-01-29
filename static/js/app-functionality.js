let newFile = window.document.getElementById("newfile")
let fileBtn = window.document.getElementById("new_file_btn")
fileBtn.onclick = function () {
    newFile.showModal()
}

let fileClose = window.document.getElementById("can1")
fileClose.onclick = function () {
    newFile.close()
}

let newDir = window.document.getElementById("newfolder")
let dirBtn = window.document.getElementById("new_dir_btn")
dirBtn.onclick = function () {
    newDir.showModal()
}

let dirClose = window.document.getElementById("can2")
dirClose.onclick = function () {
    newDir.close()
}

del = function (e) {
    e.preventDefault()
    let conf = confirm("Czy na pewno chcesz usunąć???")
    if (conf == true) {
        e.target.parentElement.submit()
    }
}

let newName = window.document.getElementById("rename")
let renameBtn = window.document.getElementById("dir_rename")
if (renameBtn != null) {
    renameBtn.onclick = function () {
        newName.showModal()
    }
}
let can3 = window.document.getElementById("can3")
can3.onclick = function () {
    newName.close()
}
