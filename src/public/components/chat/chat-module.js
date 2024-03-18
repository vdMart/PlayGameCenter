import { set, get, ref } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { query, setDoc, addDoc, doc, getDoc, collection, getDocs, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, database, db } from "./../../app/firebase.js";

const urlParams = new URLSearchParams(window.location.search);
var idGame = urlParams.get('idGame')
const timestampSTART = new Date().getTime()


document.getElementById('enviar').addEventListener('click', async () => {
    var message = document.getElementById('message').value
    var _timestamp = new Date().getTime()
    createChatRealtime(idGame, auth.currentUser.uid, message, _timestamp)
    document.getElementById('message').value = '';
});


async function readDataFirestoreByID(id) {
    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('Documento no encontrado');
        return null;
    }

    const firstDoc = querySnapshot.docs[0];
    const data = firstDoc.data();

    return data;
}


function createChatRealtime(_chatId, _userId, _message, _timestamp) {
    set(ref(database, 'chats/' + _chatId), {
        user: _userId,
        message: _message,
        timestamp: _timestamp
    });
}
//createChatRealtime('1', '2mjhkj', 'Hello', 2345);

function readDataRealtime(chatId) {
    const chatRef = ref(database, 'chats/' + chatId);
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
//readDataRealtime('1');


// Configuración de para actualizar los mensajes
let timestampOld = 0
async function imprimirMensaje(user) {
    try {
        let message = await readDataRealtime(idGame);

        if (message.timestamp >= timestampSTART && message.timestamp > timestampOld) {
            timestampOld = message.timestamp
            console.log("idUsser: " + user.uid)
            if (message.user == user.uid) {
                const chatMessages = document.getElementById('chat');
                
                const nuevoMensaje = document.createElement('div');
                nuevoMensaje.className = 'message sent';
                nuevoMensaje.innerHTML = `
                                          <div class="message-author">Tu:</div>
                                          <div class="message-text">${message.message}</div>
                                          <div class="message-timestamp">${new Date(message.timestamp).toLocaleString()}</div>`;
                
                chatMessages.appendChild(nuevoMensaje);
                console.log("otro: " + message.message);
            } else {
                const chatMessages = document.getElementById('chat');
                
                const nuevoMensaje = document.createElement('div');
                nuevoMensaje.className = 'message received';
                nuevoMensaje.innerHTML = `
                                          <div class="message-author">${await getNickById(message.user)}:</div>
                                          <div class="message-text">${message.message}</div>
                                          <div class="message-timestamp">${new Date(message.timestamp).toLocaleString()}</div>`;
                
                chatMessages.appendChild(nuevoMensaje);
                console.log("otro: " + message.message);
            }
        } else {
            console.log("No hay mensajes");
        }
    } catch (error) {
        console.error(error);
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        setInterval(() => {
            imprimirMensaje(user);
        }, 1000);
    } else {
        // El usuario no está autenticado
    }
});


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



//obtener datos del realtime de firebase, hazme una funcion en javascript que obtenga en tiempo real la nueva informacion de la base de datos y que la muestre en el html y que cada vez que se agregue un nuevo mensaje, se muestre en el html
/*
function getChatOnRealTime(chatId) {
    const ref = database.ref('chats/' + chatId);

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on('value', (snapshot) => {
        console.log(snapshot.val());
    }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
    });
}
getChatOnRealTime('1');
*/

/*
function readDataRealtime(chatId) {
    console.log('readData REALTIME DATABASE')
    const chatRef = ref(database, 'chats/' + chatId);
    get(chatRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
*/