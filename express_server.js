const express = require('express')
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var cookieParser = require('cookie-parser');
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/',(req, res)=> {
  res.send('Hello!');

});
app.listen(PORT,()=> {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//********************************************************** */
//generating a alphanumeric string for shortURL
function generateRandomString() {
  return (Math.random().toString(36).substr(2, 6));
};
//renders the http://localhost:8080/urls page with the list of short and long URL's
app.get('/urls',(req,res)=>{
  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};

  res.render("urls_index",templateVars);
})
//renders a page http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});
//it will post(submit) new short and long URL to the URL's page. Input name = req.body.longURL
app.post("/urls", (req, res) => {
  console.log('=========', req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);         
});
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

//post route to delete the url
//Add a POST route that removes a URL resource: POST /urls/:shortURL/delete
//After the resource has been deleted, redirect the client back to the urls_index page ("/urls")

app.post('/urls/:shortURL/delete',(req,res)=>{
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
//Edit the URL


app.post('/urls/:id', (req,res) =>{
  const shortURL = req.params.id;
  console.log("*******" , shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL]= longURL;
  res.redirect("/urls");
});

app.post('/login',(req,res)=>{
  //console.log(req.body);
  const username = req.body.username
  res.cookie("username",username);
  res.redirect("urls")
  //res.send("ok");
})
// /logout endpoint to clear cookies
app.post('/logout',(req,res)=>{
  //res.clearCookie("username",username);
  res.clearCookie("username");
  res.redirect("urls")
})





