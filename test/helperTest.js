const {assert} = require('chai');
const {getUserbyEmail} = require('../helpers');

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
});