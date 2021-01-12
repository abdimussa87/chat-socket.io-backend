let users = []
export const addUser = ({ id, name, room }) => {

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const userExists = users.find(user => user.name === name && user.room === room)
    if (userExists) {
        return { error: 'Username is taken for this room' }
    }
    const user = { id, name, room }
    users.push(user);
    return { user };

}

export const getUser = (id) => {
    const user = users.find(user => user.id === id)
    return user
}

export const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
}

export const removeUser = (id) => {
    const userToBeRemoved = users.find(user => user.id === id)
    if (userToBeRemoved) {
        const renewedArray = users.filter(user => user.id !== id);
        users = [...renewedArray];
        return userToBeRemoved;
    }
}