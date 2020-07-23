const users = [];

// Join user to chat
function loginUser(id, username) {
    const user = { id, username };

    users.push(user);

    return user;
}

// Get room users
function getUsers() {
    return users;
}

module.exports = {
    loginUser,
    getUsers
};