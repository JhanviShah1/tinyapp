const {assert} = require('chai');
const {getUserbyEmail,getUserbyID} = require('../helpers');

const testUsers = {
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
};
describe("getUserbyEmail", function() {
  it('should return a user with valid email', function() {
    const user = getUserbyEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(expectedOutput,user.id);
  });
  it('should return false for the invalid email', function() {
    const user = getUserbyEmail("user@exa.com", testUsers);
    assert.notEqual("user@exa.com",user.email);
  });

});

describe("getUserbyID", function() {
  it('should return a user with valid email', function() {
    const user = getUserbyID("user2RandomID", testUsers);
    const expectedOutput = "user2RandomID";
    assert.equal(expectedOutput,user.id);
  });
  it('should return null', function() {
    const user = getUserbyID("user-RandomID", testUsers);
    assert.equal(user,null);
  });

});

