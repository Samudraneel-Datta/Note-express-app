const express = require("express");
const path = require("path");
const fs = require ("fs");
const { info } = require("console");
const { name } = require("ejs");
const { title } = require("process");
const app = express();
const PORT = 3000;

// Tell Express where to find your template files
// const viewsDirectoryPath = path.join(__dirname, 'views');
// app.set('views', viewsDirectoryPath);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- MODIFIED ROUTE WITH DEBUGGING ---

app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) return res.send("Error reading directory");

    let content = [];
    let completed = 0;

    if (files.length === 0) {
      res.render('index', { file: [], content: [] });
    }

    for (let i = 0; i < files.length; i++) {
      fs.readFile(`./files/${files[i]}`, 'utf8', (err, data) => {
        if (err) {
          content[i] = "(Error reading file)";
        } else {
          content[i] = data;
        }

        completed++;

        // Once all files are read, render the page
        if (completed === files.length) {
          res.render('index', { file: files, content: content });
        }
      });
    }
  });
});

app.get('/profile/:username', (req, res) => {
  console.log(req.params.username);
  console.log("-> Request received for '/' route.");
  // Express will handle sending the response and catching errors automatically.
  res.render('index'); 
});
let a = "";
app.post('/create', (req, res)=>{
  console.log(req.body);
  fs.writeFile(`./files/${req.body.title}.txt`,`${req.body.details}`, (err)=>{
 
    res.redirect("/");
  })
})

app.get(`/notes/:username`, (req,res)=>{
  console.log(req.params.username)
  let addr = req.params.username
  let info = ""
  fs.readFile(`./files/${addr}`,"utf-8", (err,data)=>{
    res.render("notes.ejs", {name: addr, subcontent : data })
  })
 
  
})

let editName="";
app.get(`/edit/:filename`, (req,res)=>{
  editName=req.params.filename;
  fs.readFile(`./files/${req.params.filename}`,"utf-8", (err,data)=>{
    res.render("edit.ejs", {fileNameEdit: req.params.filename, subcontent2 : data })
  })
})

app.post(`/update`, (req,res)=>{
  if(req.body.notetitle == editName){
    fs.writeFile(`./files/${editName}`, `${req.body.notecontent}`, (err)=>{
      res.redirect("/");
    })
  }else{
    fs.unlink(`./files/${editName}`, (err)=>{
      if(err){
        console.log("error deleting file")
      }
    })
    fs.writeFile(`./files/${req.body.notetitle}`, `${req.body.notecontent}`,(err)=>{
      res.redirect("/");
    })
    editName=""
  }
})
// --- START SERVER ---

app.listen(PORT, () => {
  console.log(`Server started. Listening on http://localhost:${PORT}`);
  console.log("----------------------------------------------------");
});