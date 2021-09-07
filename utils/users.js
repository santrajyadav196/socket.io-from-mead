const { request } = require("express");

const users = [];


//addUser, removeUser, getUser, getUsrInroom


const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate username
    if (existingUser) {
        return {
            error: 'Username is exist!'
        }
    }

    // store user
    const user = { id, username, room };
    users.push(user);
    return { user }
}

// addUser({
//     id: 24,
//     username: '  Santraj',
//     room: 'Delhi  '
// })

// console.log(users)

// const res = addUser({
//     id: 22,
//     username: '  Santraaz',
//     room: 'Delhi ghitorni '
// })

// console.log(res)


// remove user

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// const removedUser = removeUser(22);
// console.log(removedUser);
// console.log(users);


const getUser = (id) => {
    return users.find((user) => user.id === id);
}

// const user = getUser(24);
// console.log(user);

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}

// const usersList = getUserInRoom('Delhi ghitorni')
// console.log(usersList)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
