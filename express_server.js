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
//USER DATABASE

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

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
// A FUNCTION to check user, if their the email already exists in the database
const getUserbyEmail = function(email, users){
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user 
    }
  }
  return false;
}
// A FUNCTION to check if user's the password match 
const checkPassword = function(password,users){
  for (const userID in users){
    const user = users[userID];
    if(user.password === password ){
      return user;
    }
  }
  return false;
}
//renders the http://localhost:8080/urls page with the list of short and long URL's
app.get('/urls',(req,res)=>{
  console.log("users", users);
  let userID = req.cookies["user_id"];
  const templateVars = {urls: urlDatabase, user: users[userID]};
  res.render("urls_index",templateVars);
})
//renders a page http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  let userID = req.cookies["userRandomID"];
  console.log(userID);
  console.log(users);
  const templateVars = { user: users[userID]};
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
  let userID = req.cookies["userRandomID"];
  const templateVars = { shortURL, longURL, user: users[userID] };
  res.render("urls_show", templateVars);
});

//post route to delete the url
//Add a POST route that removes a URL resource: POST /urls/:shortURL/delete
//After the resource has been deleted, redirect the client back to the urls_index page ("/urls")

app.post('/urls/:shortURL/delete',(req,res)=>{
  const shortURL = req.params.shortURL;
  //console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//Edit the URL
app.post('/urls/:id', (req,res) =>{
  const shortURL = req.params.id;
  //console.log("*******" , shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL]= longURL;
  res.redirect("/urls");
});
//Create a new template with a LOGIN FORM; this form should ask for an email and password and send a POST request to /login.Create a GET /login endpoint that responds with this new login form template

app.get('/login',(req,res)=> {
  const templateVars = {user : null};
res.render("login", templateVars);
});

app.post('/login',(req,res)=>{
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
    return res.status(400).send(" Email or Password cannot be empty ");
  }
  const user = getUserbyEmail(email, users);
  if (!user){
    return res.status(403).send(" Email not found please register to proceed ");
  }
  const userPassword = checkPassword(password, users);
    if (!userPassword) {
      return res.status(403).send("password is incorrect");
    }
  
  res.cookie("user_id",user.id);
  res.redirect("urls")
});

// /logout endpoint to clear cookies
app.post('/logout',(req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/login");
});



//Create a GET /register endpoint
app.get('/register', (req,res)=>{
  const templateVars = { user: null};
  //const templateVars = {email:email,password:password};
  res.render("register",templateVars);
});
// This endpoint should add a new user object to the global users object. The user object should include the user's id, email and password, similar to the example above. To generate a random user ID, use the same function you use to generate random IDs for URLs.
// After adding the user, set a user_id cookie containing the user's newly generated ID.
// Redirect the user to the /urls page.
// Test that the users object is properly being appended to. You can insert a console.log or debugger prior to the redirect logic to inspect what data the object contains.
// Also test that the user_id cookie is being set correctly upon redirection. You already did this sort of testing in the Cookies in Express activity. Use the same approach here.
app.post('/register',(req,res)=>{
  console.log(req.body.email);
  console.log(req.body.password);
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
    return res.status(400).send(" Email or Password cannot be empty ");
  }
  const checkUser = getUserbyEmail(email, users);
  if (checkUser){
    return res.status(400).send(" User already exists ");
  }
  const userRandomID = generateRandomString();
  const user = { id: userRandomID, email: email, password: password }
  users[userRandomID]= user;
  res.cookie("user_id" , userRandomID);
   res.redirect('/urls'); //res.redirect('/login');
  console.log("register.......",users);
});
// If the e-mail or password are empty strings, send back a response with the 400 status code.
// If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY


