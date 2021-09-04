const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const generateRandomString = function () {
  return Math.random().toString(36).substr(2, 6);
};
// A FUNCTION to check user, if their the email already exists in the database
const getUserbyEmail = function (email, users) {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return false;
};
// A FUNCTION to check if user's the password match
const checkPassword = function(password, users) {
  for (const userID in users) {
    const user = users[userID];
    //if (user.password === password)
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
  }
  return false;
};
//A FUNCTION to check a user by id
const getUserbyID = function (userID, users) {
  const user = users[userID];
  if (user) {
    return user;
  }
  return null;
};
module.exports = {generateRandomString,getUserbyID,getUserbyEmail,checkPassword };