import { auth, database, db } from "./../../app/firebase.js";
import { set, get, ref, update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { collection, getDocs, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

/* --- Scripts Room  module --- */

// Obtener listado de juegos desde Firestore
async function getGamesList() {
    try {
        // Obtener los documentos de la colección "games"
        const querySnapshot = await getDocs(collection(db, "games"));
        const gamesList = [];

        // Recorrer los documentos y agregar cada juego a la lista
        querySnapshot.forEach((doc) => {
            const gameData = doc.data();
            gamesList.push({ name: gameData.nameGame, numPlayers: gameData.numPlayers });
        });

        return gamesList;
    } catch (error) {
        console.error("Error al obtener la lista de juegos:", error);
        return [];
    }
}






// Crear una habitación en Realtime Database
function createRoomRealtime(_gameId, _gameRooms) {
    set(ref(database, 'games/' + _gameId), {
        rooms: _gameRooms,
    });
}
function addRoomRealtime(_gameId, _gameRooms) {
    update(ref(database, 'games/' + _gameId), {
        rooms: _gameRooms,
    });
}
/*
// Ejemplo de uso
const gameRooms = [
    { roomName: "Room1", players: [{ playerId: "Player1" }, { playerId: "Player2" }] },
    { roomName: "Room2", players: [{ playerId: "Player3" }, { playerId: "Player4" }] },
];
createRoomRealtime("Tetris", gameRooms);
// Ejemplo de uso
*/

function readRoomRealtime(_roomId) {
    const chatRef = ref(database, 'games/' + _roomId);
    return get(chatRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val();
        } else {
            console.log('No data available');
            return null;
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    });
}


//--------------
//-- GAMELIST --
//--------------

// Mostrar la lista de juegos en HTML
async function displayGamesList() {
    const gamesList = await getGamesList();
    const gameListElement = document.getElementById("gameList");


    // Limpiar la lista existente
    gameListElement.innerHTML = "";

    // Recorrer los juegos y agregar cada uno a la lista
    gamesList.forEach((game) => {
        const listItem = document.createElement("option");
        listItem.value = game.name;
        listItem.textContent = `${game.name} (P: ${game.numPlayers})`;
        gameListElement.appendChild(listItem);
    });
}
displayGamesList();


//--------------
//-- ROOMLIST --
//--------------

// Agregar evento de cambio al elemento gameList
const gameListElement = document.getElementById("gameList");
gameListElement.addEventListener("change", () => {
    const selectedGame = gameListElement.value;
    displayRoomsList(selectedGame);
});

// Mostrar la lista de habitaciones en HTML
async function displayRoomsList(gameName) {
    const roomsList = await getRoomsList(gameName);
    const roomListElement = document.getElementById("roomList");

    // Limpiar la lista existente
    roomListElement.innerHTML = "";

    // Recorrer las habitaciones y agregar cada una a la lista
    roomsList.forEach((room, index) => {
        const listItem = document.createElement("option");
        listItem.value = room.roomName;

        listItem.textContent = room.roomName;
        roomListElement.appendChild(listItem);
    });
}

// Obtener listado de habitaciones para un juego dado desde Realtime Database
async function getRoomsList(gameName) {
    try {
        let snapshotVal = await readRoomRealtime(gameName);
        if (snapshotVal == null) {
            return [];
        }
        return snapshotVal.rooms;
    } catch (error) {
        console.error("Error al obtener la lista de habitaciones:", error);
        return [];
    }
}


// Obtener boton "createRoomBtn" y agregar evento de click
const createRoomBtn = document.getElementById("createRoomBtn");
createRoomBtn.addEventListener("click", () => {
    const gameName = gameListElement.value;
    const roomName = prompt("Nombre de la sala:");
    const idGame = generarToken();
    if (roomName) {
        addRoomRealtime(gameName, [{ roomName: roomName, idGame: idGame, players: [] }]);
        displayRoomsList(gameName);
    }
});

//----------------
//-- PLAYERLIST --
//----------------

var globalIndex = 0;
// Agregar evento de cambio al elemento roomList
const roomListElement = document.getElementById("roomList");
roomListElement.addEventListener("change", async () => {
    //obtener el index del elemento seleccionado
    const selectedIndex = roomListElement.selectedIndex;
    globalIndex = selectedIndex;
    //const selectedRoom = roomListElement.value;
    await EnterRoom(selectedIndex);
    displayPlayersList(selectedIndex);
});

//Entrar a la sala seleccionada y salir de la sala anterior
async function EnterRoom(selectedIndex) {
    const gameName = document.getElementById("gameList").value;
    const playerId = auth.currentUser.uid;
    const roomPath = `games/${gameName}/rooms/${selectedIndex}`;
    const roomPlayersPath = `${roomPath}/roomPlayers`;

    // Referencia al nodo de roomPlayers
    const roomPlayersRef = ref(database, roomPlayersPath);

    try {
        // Obtener el array actual de roomPlayers
        const snapshot = await get(roomPlayersRef);
        const roomPlayers2 = snapshot.exists() ? snapshot.val() : [];
        const roomPlayers = Object.values(roomPlayers2);
console.log("roomPlayers: ", roomPlayers);  
        // Verificar si el jugador ya está en la habitación
        if (roomPlayers.some(player => player.id === playerId)) {
            console.log('El jugador ya está en la habitación.');
        } else {
            // Agregar el id del jugador al array
            roomPlayers.push({id: playerId, ready: false});

            // Actualizar el nodo de roomPlayers
            await set(roomPlayersRef, roomPlayers);
            console.log('RoomPlayer agregado exitosamente.');
        }
        const playBtn = document.getElementById("playBtn");
        playBtn.disabled = false;
    } catch (error) {
        console.error('Error al agregar el RoomPlayer:', error);
    }
}

var roomPlayersOld = [];
// Mostrar la lista de jugadores en HTML
async function displayPlayersList(selectedIndex) {
    const roomPlayers2 = await getPlayersList(selectedIndex);
    const roomPlayers = Object.values(roomPlayers2);
    const playerListElement = document.getElementById("playerList");


    console.log("roomPlayers: ", roomPlayers, "roomPlayersOld: ", roomPlayersOld);
    if (JSON.stringify(roomPlayersOld) !== JSON.stringify(roomPlayers)) {
        roomPlayersOld = roomPlayers;
        // Limpiar la lista existente
        playerListElement.innerHTML = "";

        // Recorrer los jugadores y agregar cada uno a la lista
        roomPlayers.forEach((player) => {
            if(player.ready) {
                getNickById(player.id).then((nickname) => {
                    const listItem = document.createElement("option");
                    listItem.textContent = nickname + " (Listo)";
                    playerListElement.appendChild(listItem);
                });
            }else {
                getNickById(player.id).then((nickname) => {
                    const listItem = document.createElement("option");
                    listItem.textContent = nickname + " (Esperando...)";
                    playerListElement.appendChild(listItem);
                });
            }
            
        });
    }
    
}

// Obtener listado de jugadores para una habitación dada desde Realtime Database
async function getPlayersList(selectedIndex) {
    try {
        const roomRef = ref(database, 'games/' + gameListElement.value + '/rooms/' + selectedIndex);
        const snapshot = await get(roomRef);
        return await snapshot.val().roomPlayers;
    } catch (error) {
        console.error("Error al obtener la lista de jugadores:", error);
        return [];
    }
}


// Obtener boton "playBtn" y agregar evento de click
const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", async () => {
    
    const gameList = document.getElementById('gameList');
    const gameSelected = gameList.value;
    const roomList = document.getElementById('roomList');
    const roomSelected = roomList.selectedIndex;
    const playerList = document.getElementById('playerList');
    const numberOfOptions = playerList.options.length;

    console.log(`Cantidad de elementos: ${numberOfOptions}`);

    const gamesList = await getGamesList();

    gamesList.forEach(async (game) => {
        let gameName = game.name
        let gameID = await getIDGame(gameSelected, roomSelected)
        let gamePlayers = game.numPlayers

        if (gameName == gameListElement.value) {
            if (gamePlayers == numberOfOptions) {
                console.log('Jugadores suficientes para iniciar el juego.');
                esperarJugador(gameName, roomSelected, gameID);
            } else {
                console.log('Faltan jugadores para iniciar el juego.');
                var modal = document.getElementById("myModal");
                modal.style.display = "block";
            }
        }
    });

});




//------------------
//-- MODAL WINDOW --
//------------------
var esperarBtn = document.getElementById("esperarBtn");
var solitarioBtn = document.getElementById("solitarioBtn");

esperarBtn.onclick = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

solitarioBtn.onclick = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
    var modal = document.getElementById("myModalWait");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



// Función para obtener los nicknames de una lista de IDs de usuarios
async function getNickById(userId) {
    const q = query(collection(db, "users"), where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];

        const userInfo = firstDoc.data();

        const nickname = userInfo.nickname;
        return nickname;
    }
    return 'null';
}


function generarToken() {
  return Math.random().toString(36).substr(2);
}










async function getIDGame(gameSelected, roomSelected) {
    try {
        const roomRef = ref(database, 'games/' + gameSelected + '/rooms/' + roomSelected);
        const snapshot = await get(roomRef);
        console.log("ID de la partida: ", snapshot.val().idGame);
        return await snapshot.val().idGame;
    } catch (error) {
        console.error("Error al obtener el id de la partida:", error);
        return [];
    }
}


setInterval(() => {
    displayPlayersList(globalIndex);
}, 1000);




async function esperarJugador(gameName, roomSelected, gameID) {

    setReady(gameName, roomSelected, gameID);

    let ready = await getStatusPlayer(gameName, roomSelected, gameID)
    while(!ready){
        var modal = document.getElementById("myModalWait");
        modal.style.display = "block";
        
        ready = await getStatusPlayer(gameName, roomSelected, gameID)
    }
    console.log("Todos los jugadores estan listos" + ready);

    var urlDestino = `../game/${gameName}/${gameName}.html?idgame=${gameID}`;
    window.location.href = urlDestino;

}



async function getStatusPlayer(gameName, roomSelected, gameID) {
    try {
        const playersRef = ref(database, 'games/' + gameName + '/rooms/' + roomSelected + '/roomPlayers');
        const snapshot = await get(playersRef);
        let ok = true;
        snapshot.forEach((player) => {
            console.log("jugadore: " + player.val().ready);
            if(player.val().ready == true){
                ok = true;
            }else{
                throw new Error("No estan listos.");
            }
        });
        return ok;
    } catch (error) {
        console.error("Error al obtener el id de la partida:", error);
        return false;
    }
}

//Obtener el jugador por el id de Realtimedatabase de firebase y establecer su campo ready a true
async function setReady(gameName, roomSelected, gameID) {
    try {
        const playersRef = ref(database, 'games/' + gameName + '/rooms/' + roomSelected + '/roomPlayers');
        const snapshot = await get(playersRef);
        console.log("juggfhdghghfgh: " + snapshot.val());
        snapshot.forEach((player) => {
            console.log("jugadoreasdf: " + player.val().id);
            if(player.val().id == auth.currentUser.uid){
                update(ref(database, 'games/' + gameName + '/rooms/' + roomSelected + '/roomPlayers/' + player.key), {
                    ready: true,
                });
            }
        });
    } catch (error) {
        console.error("Error al obtener el id de la partida:", error);
        return [];
    }
}