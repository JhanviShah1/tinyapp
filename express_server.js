const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
const {
  generateRandomString,
  getUserbyID,
  getUserbyEmail,
  checkPassword,
} = require("./helpers");

//URL DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};
//USER DATABASE
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.redirect("/register");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//renders the http://localhost:8080/urls page with the list of short and long URL's
app.get("/urls", (req, res) => {
  let userID = req.session["user_id"];
  const user = getUserbyID(userID, users);
  const filterURL = {};
  if (user) {
    for (const shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userID === userID) {
        filterURL[shortURL] = urlDatabase[shortURL];
      }
    }
    const templateVars = { urls: filterURL, user: users[userID] };
    res.render("urls_index", templateVars);
  } else {
    res.status(402).send("not allowed");
  }
});
//renders a page http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  let userID = req.session["user_id"];
  const user = getUserbyID(userID, users);
  if (user) {
    const templateVars = { user: users[userID] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//it will post(submit) new short and long URL to the URL's page.
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session["user_id"];
  const longURL = req.body.longURL;
  const newURL = { longURL, userID };
  urlDatabase[shortURL] = newURL;
  if (userID) {
    res.redirect(`/urls/${shortURL}`);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userID = req.session["user_id"];
  if (urlDatabase[shortURL].userID === userID) {
    const user = getUserbyID(userID, users);
    if (user) {
      const templateVars = { shortURL, longURL, user: users[userID] };
      res.render("urls_show", templateVars);
    } else {
      res.status(402).send("not allowed");
    }
  } else {
    res.status(402).send("URL does not belong to you");
  }
});

//post route to delete the url
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

//Edit the URL
app.post("/urls/:id", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.id;
  if (urlDatabase[shortURL].userID === userID) {
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

//Create a new template with a login form
app.get("/login", (req, res) => {
  const templateVars = { user: null };
  res.render("login", templateVars);
});

// Create a GET /login endpoint that responds with this new login form template
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send(" Email or Password cannot be empty ");
  }
  const user = getUserbyEmail(email, users);
  if (!user) {
    return res.status(403).send(" Email not found please register to proceed ");
  }
  const userPassword = checkPassword(password, users);
  if (!userPassword) {
    return res.status(403).send("password is incorrect");
  }
  req.session.user_id = user.id;
  res.redirect("urls");
});

// logout endpoint to clear cookies
app.post("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session = null;
  res.redirect("/login");
});

//Create a GET /register endpoint
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

// This endpoint should add a new user object to the global users object.
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send(" Email or Password cannot be empty ");
  }
  const checkUser = getUserbyEmail(email, users);
  if (checkUser) {
    return res.status(400).send(" User already exists ");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userRandomID = generateRandomString();
  const user = { id: userRandomID, email: email, password: hashedPassword };
  users[userRandomID] = user;
  req.session.user_id = user.id;
  res.redirect("/urls");
});
