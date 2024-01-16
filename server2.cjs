const express = require("express");
const app = express();
const PORT = 3300;
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const hbs = require("express-handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        nawigacja: function(path){
            let pathElements = path.split("/");
            let pathBox = `<div> <a href="/filemanager2" class="pathTeil">home</a></div>`;
            let pathElement = "";
            for (i = 0; i < pathElements.length; i++) {
                pathElement += pathElements[i] + "/";
                console.log("POMPOM", pathElement);
                pathBox += `<div> <a href="/filemanager2?path=${pathElement}" class="pathTeil">&nbsp;> ${pathElements[i]}</a></div>`;
            }
            return pathBox;
        },
    }
}));

app.set('view engine', 'hbs');
app.use(express.static('static'));
app.use(express.static('upload'));

const uploadDirPath = path.join(__dirname, "upload");
let pliki = [];
let katalogi = [];
const extensionsArray = ["txt", "html", "css", "js"];

function getFileExtension(extension){
    let ext = "";
    switch(extension){
        case "docx":
            ext = "../gfx/docx.png";
            break
        case "jpeg":
            ext = "../gfx/jpeg.png";
            break
        case "jpg":
            ext = "../gfx/jpg.png";
            break
        case "html":
            ext = "../gfx/html.png";
            break
        case "css":
            ext = "../gfx/css.png";
            break  
        case "js":
            ext = "../gfx/js.png";
            break
        case "pdf":
            ext = "../gfx/pdf.png";
            break
        case "png":
            ext = "../gfx/png.png";
            break
        case "txt":
            ext = "../gfx/txt.png";
            break
        case "zip":
            ext = "../gfx/zip.png";
            break
        default: 
            ext = "../gfx/other.png";
    }
    console.log("11111",ext);
    return ext;
}

//////////////////////////////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
    res.redirect('/filemanager2');
})

app.get("/newFile", function(req, res){
    const fullFileName = `${req.query.input1}${req.query.extensionSelect}`;
    if(req.query.input1 == ""){
        res.redirect("/filemanager2");
    }
    else{
        let insideUploadPath = null;
        // console.log(uploadDirPath);
        if(req.query.sciezka != null){
            insideUploadPath = path.join(uploadDirPath, req.query.sciezka);
            // console.log('insideUploadPath2', insideUploadPath);
        } 
        else{
            insideUploadPath = uploadDirPath;
        }


        if(fs.existsSync(path.join(insideUploadPath, fullFileName))){
            let pom = 1;
            let poz = fullFileName.split(".");
            let nazwa = poz.shift();
            let nowa = "";
            while(true){
                nowa = `${nazwa}_(${pom}).${poz.join(".")}`;
                if(fs.existsSync(path.join(insideUploadPath, nowa))){
                    pom += 1
                }
                else{
                    break;
                }
            }
            let splitek = nowa.split(".").at(-1)
            if(extensionsArray.includes(splitek)){
                fs.readFile(path.join(__dirname, "static", "defaults", "default." + splitek), (error, data)=>{
                    if (error) throw error;
                    fs.writeFile(path.join(insideUploadPath, nowa), data.toString(), (err) => {
                        if(err) throw err;
                        if(req.query.sciezka == null){
                            res.redirect("/filemanager2");
                        }
                        else{
                            res.redirect("/filemanager2?path=" + req.query.sciezka);
                        }
                    })
                })
            } 
            else{
                fs.writeFile(path.join(insideUploadPath, nowa), "", (err)=>{
                    if(err) throw err;
                    if(req.query.sciezka == null){
                        res.redirect("/filemanager2");
                    }
                    else{
                        res.redirect("/filemanager2?path=" + req.query.sciezka);
                    }
                })
            }
        } 
        else{
            let splitek = fullFileName.split(".").at(-1);
            if(extensionsArray.includes(splitek)){
                fs.readFile(path.join(__dirname, "static", "defaults", "default." + splitek), (error, data)=>{
                    if(error) throw error;
                    fs.writeFile(path.join(insideUploadPath, fullFileName), data.toString(), (err)=>{
                        if(err) throw err;
                        if(req.query.sciezka == null){
                            res.redirect("/filemanager2");
                        }
                        else{
                            res.redirect("/filemanager2?path=" + req.query.sciezka);
                        }
                    })
                })
            } 
            else{
                fs.writeFile(path.join(insideUploadPath, fullFileName), "", (err)=>{
                    if(err) throw err;
                    if(req.query.sciezka == null){
                        res.redirect("/filemanager2");
                    }
                    else{
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
            let pom = 1
            let nazwa = req.query.input2
            let nowa = ""
            while (true) {
                nowa = `${nazwa}_(${pom})`
                if (fs.existsSync(path.join(insideUploadPath, nowa))) {
                    pom += 1
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
        let splitujemy = req.query.path.split("/")
        if (req.query.path == "" || splitujemy.includes(".") || splitujemy.includes("..") || !fs.existsSync(path.join(uploadDirPath, req.query.path))) {
            res.redirect("/filemanager2")
            return
        }
        insideUploadPath = path.join(uploadDirPath, req.query.path)
    }
    else {
        insideUploadPath = uploadDirPath
    }
    fs.readdir(insideUploadPath, { withFileTypes: true }, (err, files) => {
        pliki = []
        katalogi = []
        files.forEach(file => {
            if(file.isFile()){
                let fileExtension = file.name.split(".")[1];
                console.log(fileExtension);
                let obj = {
                    nazwa: file.name,
                    zdjecie: getFileExtension(fileExtension),
                }
                pliki.push(obj)
            }
            else{
                let obj = {
                    nazwa: file.name,
                }
                katalogi.push(obj);
            }
        })
        let context = {
            files: pliki,
            directories: katalogi,
            adres: null
        }

        if (req.query.path == undefined || req.query.path == "" || !fs.existsSync(insideUploadPath)) {
            adres = "/filemanager2"
        }
        else {
            context.adres = req.query.path

        }
        
        console.log("ctx",context);
        res.render('filemanager2.hbs', context)

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
        console.log(field);
        parsujemy = field
        if (field != null) {
            insideUploadPath = path.join(uploadDirPath, field)
        } else {
            insideUploadPath = uploadDirPath
        }
    })
    form.on("file", (err, plik) => {
        console.log(plik);
        if (fs.existsSync(path.join(insideUploadPath, plik.name))) {

            let pom = 1
            let poz = plik.name.split(".")
            let nazwa = poz.shift()
            console.log(nazwa);
            let nowa = ""
            while (true) {
                nowa = `${nazwa}_(${pom}).${poz.join(".")}`
                if (fs.existsSync(path.join(insideUploadPath, nowa))) {
                    pom += 1
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
    // form.parse(req)
    // console.log("RIIIIIIII",req);
    form.on("end", () => {
        if (parsujemy == null) {
            res.redirect("/filemanager2")
        }
        else {
            res.redirect("/filemanager2?path=" + parsujemy)
        }
    })

});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

