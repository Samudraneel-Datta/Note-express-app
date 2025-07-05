const express = require("express");
const path = require("path");
const fs = require ("fs");
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

// --- START SERVER ---

app.listen(PORT, () => {
  console.log(`Server started. Listening on http://localhost:${PORT}`);
  console.log("----------------------------------------------------");
});