const express = require("express");
const app = express();
const PORT = 3300;
const fs = require("fs");
const path = require("path");
const hbs = require("express-handlebars");
const formidable = require("formidable");
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        settingURL: function (path) {
            let pathElements = path.split("/");
            let pathBox = `<div><a href="/filemanager2" class="pathTeil">home</a></div>`;
            let pathElement = "";

            for (i = 0; i < pathElements.length; i += 1) {
                pathElement += pathElements[i] + "/";
                pathBox += `<div><a href="/filemanager2?path=${pathElement}" class="pathTeil">&nbsp;&lt; ${pathElements[i]}</a></div>`;
            }
            return pathBox;
        },

        txtExtensions: function (nazwa) {
            let fileExtHelper = nazwa.split(".");
            if (extensionsArray.includes(fileExtHelper.at(-1).toLowerCase())) {
                return true;
            }
        }
    }
}));

app.set('view engine', 'hbs');
app.use(express.static('static'));
app.use(express.static('upload'));

const uploadDirPath = path.join(__dirname, "upload");
let filesArray = [];
let dirsArray = [];
const extensionsArray = ["txt", "xml", "json", "html", "css", "js"];

function getFileExtension(extension) {
    let ext = "";
    switch (extension) {
        case "docx": ext = "../gfx/docx.png"; break
        case "jpeg": ext = "../gfx/jpeg.png"; break
        case "jpg": ext = "../gfx/jpg.png"; break
        case "html": ext = "../gfx/html.png"; break
        case "css": ext = "../gfx/css.png"; break
        case "js": ext = "../gfx/js.png"; break
        case "pdf": ext = "../gfx/pdf.png"; break
        case "png": ext = "../gfx/png.png"; break
        case "txt": ext = "../gfx/txt.png"; break
        case "zip": ext = "../gfx/zip.png"; break
        case "xml": ext = "../gfx/xml.png"; break
        default: ext = "../gfx/other.png";
    }
    return ext;
}

//////////////////////////////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
    res.redirect('/filemanager2');
})

app.get("/newFile", function (req, res) {
    const fullFileName = `${req.query.input1}${req.query.extensionSelect}`;
    if (req.query.input1 == "") {
        res.redirect("/filemanager2");
    }
    else {
        let insideUploadPath = null;
        if (req.query.sciezka != null) {
            insideUploadPath = path.join(uploadDirPath, req.query.sciezka);
        }
        else {
            insideUploadPath = uploadDirPath;
        }


        if (fs.existsSync(path.join(insideUploadPath, fullFileName))) {
            let counter = 1;
            let poz = fullFileName.split(".");
            let nazwa = poz.shift();
            let nowa = "";
            while (true) {
                nowa = `${nazwa}_(${counter}).${poz.join(".")}`;
                if (fs.existsSync(path.join(insideUploadPath, nowa))) {
                    counter += 1
                }
                else {
                    break;
                }
            }
            let fileExt = nowa.split(".").at(-1)
            if (extensionsArray.includes(fileExt)) {
                fs.readFile(path.join(__dirname, "static", "samples", "default." + fileExt), (error, data) => {
                    if (error) throw error;
                    fs.writeFile(path.join(insideUploadPath, nowa), data.toString(), (err) => {
                        if (err) throw err;
                        if (req.query.sciezka == null) {
                            res.redirect("/filemanager2");
                        }
                        else {
                            res.redirect("/filemanager2?path=" + req.query.sciezka);
                        }
                    })
                })
            }
            else {
                fs.writeFile(path.join(insideUploadPath, nowa), "", (err) => {
                    if (err) throw err;
                    if (req.query.sciezka == null) {
                        res.redirect("/filemanager2");
                    }
                    else {
                        res.redirect("/filemanager2?path=" + req.query.sciezka);
                    }
                })
            }
        }
        else {
            let fileExt = fullFileName.split(".").at(-1);
            if (extensionsArray.includes(fileExt)) {
                fs.readFile(path.join(__dirname, "static", "samples", "default." + fileExt), (error, data) => {
                    if (error) throw error;
                    fs.writeFile(path.join(insideUploadPath, fullFileName), data.toString(), (err) => {
                        if (err) throw err;
                        if (req.query.sciezka == null) {
                            res.redirect("/filemanager2");
                        }
                        else {
                            res.redirect("/filemanager2?path=" + req.query.sciezka);
                        }
                    })
                })
            }
            else {
                fs.writeFile(path.join(insideUploadPath, fullFileName), "", (err) => {
                    if (err) throw err;
                    if (req.query.sciezka == null) {
                        res.redirect("/filemanager2");
                    }
                    else {
                        res.redirect("/filemanager2?path=" + req.query.sciezka);
                    }
                })
            }
        }
    }
})


app.get("/newFolder", function (req, res) {
    if (req.query.input2 == "") {
        res.redirect("/filemanager2")
    }
    else {
        let insideUploadPath = null
        if (req.query.sciezka != null) {
            insideUploadPath = path.join(uploadDirPath, req.query.sciezka)
        } else {
            insideUploadPath = uploadDirPath
        }

        if (fs.existsSync(path.join(insideUploadPath, req.query.input2))) {
            let counter = 1
            let nazwa = req.query.input2
            let nowa = ""
            while (true) {
                nowa = `${nazwa}_(${counter})`
                if (fs.existsSync(path.join(insideUploadPath, nowa))) {
                    counter += 1
                }
                else {
                    break
                }
            }
            fs.mkdir(path.join(insideUploadPath, nowa), (err) => {
                if (err) throw err
                if (req.query.sciezka == null) {
                    res.redirect("/filemanager2")
                }
                else {
                    res.redirect("/filemanager2?path=" + req.query.sciezka)
                }
            })
        } else {
            fs.mkdir(path.join(insideUploadPath, req.query.input2), (err) => {
                if (err) throw err
                if (req.query.sciezka == null) {
                    res.redirect("/filemanager2")
                }
                else {
                    res.redirect("/filemanager2?path=" + req.query.sciezka)
                }
            })
        }
    }
})


app.get("/filemanager2", function (req, res) {
    let insideUploadPath = null
    if (req.query.path != undefined) {
        let pathValidate = req.query.path.split("/")
        if (req.query.path == "" || pathValidate.includes(".") || pathValidate.includes("..") || !fs.existsSync(path.join(uploadDirPath, req.query.path))) {
            res.redirect("/filemanager2")
            return
        }
        insideUploadPath = path.join(uploadDirPath, req.query.path)
    }
    else {
        insideUploadPath = uploadDirPath
    }
    fs.readdir(insideUploadPath, { withFileTypes: true }, (err, files) => {
        filesArray = []
        dirsArray = []
        files.forEach(file => {
            if (file.isFile()) {
                let fileExtension = file.name.split(".")[1];
                let obj = {
                    nazwa: file.name,
                    zdjecie: getFileExtension(fileExtension),
                }
                filesArray.push(obj)
            }
            else {
                let obj = {
                    nazwa: file.name,
                }
                dirsArray.push(obj);
            }
        })
        let locationContent = {
            files: filesArray,
            directories: dirsArray,
            addresses: null
        }

        if (req.query.path == undefined || req.query.path == "" || !fs.existsSync(insideUploadPath)) {
            addresses = "/filemanager2"
        }
        else {
            locationContent.addresses = req.query.path

        }
        res.render('filemanager2.hbs', locationContent)
    })
})


app.get("/delete", function (req, res) {
    let insideUploadPath = null
    if (req.query.sciezka != null) {
        insideUploadPath = path.join(uploadDirPath, req.query.sciezka)
    } else {
        insideUploadPath = uploadDirPath
    }

    fs.lstat(path.join(insideUploadPath, req.query.hidden), (err, stats) => {
        if (stats.isDirectory()) {
            fs.rm(path.join(insideUploadPath, req.query.hidden), {
                recursive: true, force: true
            }, (err) => {
                if (err) throw err
                if (req.query.sciezka == null) {
                    res.redirect("/filemanager2")
                }
                else {
                    res.redirect("/filemanager2?path=" + req.query.sciezka)
                    return
                }
            })
        }
        else {
            fs.unlink(path.join(insideUploadPath, req.query.hidden), (err) => {
                if (err) throw err
                if (req.query.sciezka == null) {
                    res.redirect("/filemanager2")
                }
                else {
                    res.redirect("/filemanager2?path=" + req.query.sciezka)
                }
            })
        }
    })

})


app.post('/upload', function (req, res) {
    let insideUploadPath = null
    let parsujemy = null

    let form = formidable({});

    form.uploadDir = uploadDirPath
    form.keepExtensions = true
    form.multiples = true
    form.on("field", (name, field) => {
        parsujemy = field
        if (field != null) {
            insideUploadPath = path.join(uploadDirPath, field)
        } else {
            insideUploadPath = uploadDirPath
        }
    })
    form.on("file", (err, plik) => {
        if (fs.existsSync(path.join(insideUploadPath, plik.name))) {

            let counter = 1
            let poz = plik.name.split(".")
            let nazwa = poz.shift()
            let nowa = ""
            while (true) {
                nowa = `${nazwa}_(${counter}).${poz.join(".")}`
                if (fs.existsSync(path.join(insideUploadPath, nowa))) {
                    counter += 1
                }
                else {
                    break
                }
            }
            fs.rename(plik.path, path.join(insideUploadPath, nowa), (err) => {
                if (err) throw err
            })

        } else {
            fs.rename(plik.path, path.join(insideUploadPath, plik.name), (err) => {
                if (err) throw err
            })
        }
    })
    form.parse(req)
    form.on("end", () => {
        if (parsujemy == null) {
            res.redirect("/filemanager2")
        }
        else {
            res.redirect("/filemanager2?path=" + parsujemy)
        }
    })

});


app.get("/rename", function (req, res) {
    let oldDirFullPath = req.query.location
    let renamedDirPath = path.dirname(oldDirFullPath)
    let renamedDirFullPath = path.join(renamedDirPath, req.query.newName)

    if (fs.existsSync(path.join(uploadDirPath, renamedDirFullPath))) {
        let counter = 1
        let nazwa = req.query.newName
        let nowa = ""
        while (true) {
            nowa = `${nazwa}_(${counter})`
            if (fs.existsSync(path.join(uploadDirPath, renamedDirPath, nowa))) {
                counter += 1
            }
            else {
                break
            }
        }
        fs.rename(path.join(uploadDirPath, oldDirFullPath), path.join(uploadDirPath, renamedDirPath, nowa), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${renamedDirPath + "/" + nowa}`)
        })
    }
    else {
        fs.rename(path.join(uploadDirPath, oldDirFullPath), path.join(uploadDirPath, renamedDirFullPath), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${renamedDirFullPath}`)
        })
    }

})


app.get("/edytor", function (req, res) {
    if (req.query.file == undefined) {
        return res.redirect("/filemanager2")
    }
    // let fullName = req.query.file.split("/")
    // if (fullName.includes("..") || fullName.includes(".") || req.query.file == "") {
    //     return res.redirect("/filemanager2")
    // }
    if (fs.existsSync(path.join(uploadDirPath, req.query.file))) {
        let extension = req.query.file.split(".")
        if (extensionsArray.includes(extension.at(-1).toLowerCase())) {
            fs.readFile(path.join(uploadDirPath, req.query.file), (err, data) => {
                if (err) throw err
                let locationContent = {
                    file: req.query.file,
                    fileContent: data.toString()
                }
                console.log("tak",locationContent.file);
                res.render("edytor.hbs", locationContent)
            })
        }
        else {
            res.redirect("/filemanager2")
        }

    } else {
        res.redirect("/filemanager2")
    }
})


app.post("/set", function (req, res) {
    fs.readFile(path.join(__dirname, "static", "settings.json"), (err, data) => {
        console.log(data.toString());
        if (err) throw err
        console.log(data.toString());
        res.send(JSON.parse(data.toString()))
    })
})


app.post("/zapisz", function (req, res) {
    fs.writeFile(path.join(__dirname, "static", "settings.json"), req.body, (err) => {
        if (err) throw err
        res.send("Zapisano zmiany poprawnie")
    })
})


app.post("/edytor", function (req, res) {
    fs.writeFile(path.join(uploadDirPath, req.body.hidek), req.body.edytor, (err) => {
        if (err) throw err
        console.log("XDDD");
        res.redirect(`/filemanager2?path=${path.dirname(req.body.hidek)}`)
    })
})


app.get("/rename2", function (req, res) {
    let hiden = req.query.hidden
    let nowanazwa = path.dirname(hiden)
    let lacze = path.join(nowanazwa, req.query.nazwa)

    if (fs.existsSync(path.join(rootpath, lacze))) {
        let pom = 1
        let poz = req.query.nazwa.split(".")
        let nazwa = poz.shift()
        let nowa = ""
        while (true) {
            nowa = `${nazwa}_(${pom}).${poz.join(".")}`
            if (fs.existsSync(path.join(uploadDirPath, nowanazwa, nowa))) {
                pom += 1
            }
            else {
                break
            }
        }
        fs.rename(path.join(uploadDirPath, hiden), path.join(uploadDirPath, nowanazwa, nowa), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${nowanazwa}`)
        })
    }
    else {
        fs.rename(path.join(uploadDirPath, hiden), path.join(uploadDirPath, lacze), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${nowanazwa}`)
        })
    }

})


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

