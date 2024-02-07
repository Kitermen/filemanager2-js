const express = require("express");
const app = express();
const PORT = 3300;
const fs = require("fs");
const path = require("path");
const hbs = require("express-handlebars");
const formidable = require("formidable");
const cookieparser = require("cookie-parser");
app.use(cookieparser());
const nocache = require("nocache");
app.use(nocache())
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        settingURL: function (path) {
            let pathElements = path.split("/");
            let pathBox = `<div class="pathTeil">Structure:</a></div>`;
            let pathElement = "";

            for (i = 0; i < pathElements.length; i += 1) {
                pathElement += pathElements[i] + "/";
                if(pathElement[pathElement.length - 1] && pathElement[pathElement.length - 2] == "/"){
                    pathElement = pathElement.slice(0, pathElement.length - 1)
                }
                pathBox += `<div><a href="/filemanager2?path=${pathElement}" class="pathTeil">&nbsp;${pathElements[i]}&nbsp;&gt;</a></div>`;  
            }
            return pathBox;
        },

        txtExtensions: function (nazwa) {
            let fileExtHelper = nazwa.split(".");
            if (allExtensionsArray.includes(fileExtHelper.at(-1).toLowerCase())) {
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
const allExtensionsArray = ["txt", "xml", "json", "html", "css", "js", "jpg", "jpeg", "png"];

const Datastore = require('nedb')

const passes = new Datastore({
    filename: 'passes.db',
    autoload: true
});

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

////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
    res.redirect('/register');
});


app.get("/register", function (req, res) {
    res.render('register.hbs');
});


app.post("/registerSub", function (req, res) {
    const login = req.body.regName;
    const password = req.body.regPass;
    const password2 = req.body.validPass;
    console.log(req.body);
    if(password == password2){
        passes.count({ a: login }, function (err, count) {
            console.log("powtorek jest: ", count)
            if(count == 0){
                const data = {a: login, b: password};
                passes.insert(data);
                fs.mkdir(path.join(uploadDirPath, login), (err) => {
                    if (err) throw err
                })
                res.redirect("/login");
            }
            else{
                res.redirect("/error");
            }
        })
    }
    else{
        res.redirect("/error");
    }
        
});


app.get("/login", function (req, res) {
    res.render('login.hbs');
});


app.post("/loginSub", function (req, res) {
    const login = req.body.logName;
    const password = req.body.logPass;
    passes.count({ a: login }, function (err, countLog) {
        passes.count({ b: password }, function (err, countPass) {
            if(countLog == 1 && countPass == 1){
                res.redirect("/filemanager2?path=" + login)
            }
            else{
                res.redirect("/error");
            }
        })
    })
});


app.get("/error", function (req, res) {
    res.render('error.hbs');
});


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
        let name = req.query.newName;
        let dirNameAdjuster = "";
        let counter = 1;
        while (true) {
            dirNameAdjuster = `${name}_(${counter})`;
            if (fs.existsSync(path.join(uploadDirPath, renamedDirPath, dirNameAdjuster))) {
                counter += 1;
            }
            else {
                break;
            }
        }
        fs.rename(path.join(uploadDirPath, oldDirFullPath), path.join(uploadDirPath, renamedDirPath, nowa), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${renamedDirPath + "/" + dirNameAdjuster}`);
        })
    }
    else {
        fs.rename(path.join(uploadDirPath, oldDirFullPath), path.join(uploadDirPath, renamedDirFullPath), (err) => {
            if (err) throw err
            res.redirect(`/filemanager2?path=${renamedDirFullPath}`);
        })
    }
});


app.get("/edytor", function (req, res) {
    if (req.query.file == undefined) {
        return res.redirect("/filemanager2");
    }
    let fullFilePath = req.query.file;
    if (fs.existsSync(path.join(uploadDirPath, fullFilePath))) {
        let extension = fullFilePath.split(".");
        if (extensionsArray.includes(extension.at(-1).toLowerCase())) {
            fs.readFile(path.join(uploadDirPath, fullFilePath), (err, data) => {
                if (err) throw err
                let locationContent = {
                    file: fullFilePath,
                    fileContent: data.toString()
                }
                //file w sensie pełna ścieżka wraz z rozszerzeniem do pliku
                res.render("edytor.hbs", locationContent);
            })
        } 
        else if (extension.at(-1).toLowerCase() == "jpg" || extension.at(-1).toLowerCase() == "jpeg" || extension.at(-1).toLowerCase() == "png") {
            let context = {
                tab: ["grayscale", "invert", "sepia", "none"],
                file: fullFilePath
            }
            res.render("images.hbs", context);
        }
        else {
            res.redirect("/filemanager2");
        }

    } else {
        res.redirect("/filemanager2");
    }
});


app.post("/set", function (req, res) {
    fs.readFile(path.join(__dirname, "static", "settings.json"), (err, data) => {
        if (err) throw err
        res.send(JSON.parse(data.toString()))
    })
});


app.post("/saveLayout", function (req, res) {
    console.log(req.body);
    fs.writeFile(path.join(__dirname, "static", "settings.json"), req.body, (err) => {
        if (err) throw err
        res.send("Zapisano zmiany poprawnie")
    })
});


app.post("/saveTxt", function (req, res) {
    fs.writeFile(path.join(uploadDirPath, req.body.fullPath), req.body.edytor, (err) => {
        if (err) throw err
        res.redirect(`/filemanager2?path=${path.dirname(req.body.fullPath)}`)
    })
});


app.post("/saveImg", function (req, res) {
    let form = formidable({});
    form.uploadDir = uploadDirPath;
    form.parse(req, (err, fields, files) => {
        console.log("fie",fields);
        fs.rename(files.canvasImg.path, path.join(uploadDirPath, fields.filePath), (err) => {
            if (err) throw err
            res.send("");
        })
    })
});


app.get("/showImg", function (req, res) {
    console.log(req.query.img);
    res.sendFile(path.join(uploadDirPath, req.query.img));
});


app.get("/renameFile", function (req, res) {
    if (req.query.fileName == "") {
        res.redirect("/filemanager2");
    }
    else{
        let fullPath = req.query.fullPath;
        let pathToFile = path.dirname(fullPath);
        let fileName = req.query.fileName;
        let getFileExt = `.${fullPath.split(".")[1]}`;
        let newFileName = `${fileName}${getFileExt}`
        let newFullPath = path.join(pathToFile, newFileName);
    
        if (fs.existsSync(path.join(uploadDirPath, newFullPath))) {
            let fileNameAdjuster = "";
            let counter = 1;
            while (true) {
                fileNameAdjuster = `${fileName}_(${counter}).${getFileExt}`;
                if (fs.existsSync(path.join(uploadDirPath, pathToFile, fileNameAdjuster))) {
                    counter += 1;
                }
                else {
                    break;
                }
            }
            fs.rename(path.join(uploadDirPath, fullPath), path.join(uploadDirPath, pathToFile, fileNameAdjuster), (err) => {
                if (err) throw err
                res.redirect(`/filemanager2?path=${pathToFile}`);
            })
        }
        else {
            fs.rename(path.join(uploadDirPath, fullPath), path.join(uploadDirPath, newFullPath), (err) => {
                if (err) throw err
                res.redirect(`/filemanager2?path=${pathToFile}`);
            })
        }
    }
});


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});

