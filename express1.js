const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get('/',(req,res)=>{
  res.send('Hello there! enjoying your first app?');
});
app.listen(PORT, ()=>{
  console.log(`Express1 app listening on port ${PORT}!`);
});
//we can add additional endpoints 
app.get('/urltoJson',(req,res)=>{
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//************************************************************//
//generating a alphanumeric string for shortURL
function generateRandomString() {
  return (Math.random().toString(36).substr(2, 6));
};
//renders the c/urls page with the list of short and long URL's
app.get('/urls', (req,res)=>{
  templateVars = {urls: urlDatabase};
  res.render('index1',templateVars);
});
//renders a page http://localhost:8080/urls/new
app.get('/urls/new', (req,res) => {
  templateVars = {urls: urlDatabase};
  res.render('new1',templateVars);
});
 //it will post(submit) new short and long URL to the URL's page. Input name = req.body.longURL
  app.post("/urls", (req, res) => {
    console.log(req.body); 
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL]=longURL;                             
    res.redirect(`/urls/${shortURL}`);  //redirect the urls/:shorturl page       
  });

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});
app.get('/urls/:shortURL' ,(req,res)=>{
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log(longURL);
  templateVars = {shortURL,longURL};
  //console.log(`templateVars:----${JSON.stringify(templateVars)}`);
  //console.log("urlDatabase:...",urlDatabase);
  res.render("show1",templateVars);
});
app.post('/urls/:shortURL/delete',(req,res)=>{
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL];
  res.redirect("/urls");
})
app.post('/urls/:id', (req,res) =>{
  const shortURL = req.params.id;
  console.log("*******" , shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL]= longURL;
  res.redirect("/urls");
});
