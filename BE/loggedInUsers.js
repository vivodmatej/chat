// shranjeni trenutno prijavljeni uporabniki in manipulacija z njimi
let loggedInUsers = [];

const addUser = (user) => {
  loggedInUsers.push(user);
};

const removeUser = (userId) => {
  loggedInUsers = loggedInUsers.filter(user => user.id !== userId);
};

const getUsers = () => {
  return loggedInUsers;
};

module.exports = { addUser, removeUser, getUsers };
