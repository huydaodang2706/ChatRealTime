const rooms = [];

// new room created
function newRoom(room_name) {
    const room = { room_name };

    rooms.push(room);

    return room;
}

// Get current room
function getCurrentRoom(room_name) {
    return rooms.find(room => room.room_name === room_name);
}

function getAllRoom() {
    return rooms;
}
module.exports = {
    newRoom,
    getCurrentRoom,
    getAllRoom
};