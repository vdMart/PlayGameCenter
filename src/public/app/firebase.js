import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, query, setDoc, addDoc, doc, getDoc, collection, getDocs, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { getDatabase, set, get, ref, child } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAnH-JWuA-OwH_LgnVMdH1OqNGY5VtMpBU",
    authDomain: "playgamecenter-69900.firebaseapp.com",
    projectId: "playgamecenter-69900",
    storageBucket: "playgamecenter-69900.appspot.com",
    messagingSenderId: "391961793287",
    appId: "1:391961793287:web:69e4632490b956dfe3aba2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const database = getDatabase(app)





/*
//Agregar datos a la base de datos Firestore
function writeUserData(userId, name, email) {
    console.log('writeUserData')
    getDocs(collection(db, "users")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`${doc.id} =>`, data)
        });
    });
    console.log('writeUserData')
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
    });
}
writeUserData(234, "defs", "peteasd@asdasdc.com")












// ---FIREBASE AUTHENTICATION ---
//Sign Up

//Sign In

//Sign Out





// --- FIRESTORE DATABASE ---
//CREATE DATA
export function createDataFirestore(_id, _nickname, _email) {
    console.log('createData FIRESTORE DATABASE')
    addDoc(collection(db, "users"), {
        id: _id,
        nickname: _nickname,
        email: _email,
    }); 
}
//createDataFirestore()

//READ DATA
export function readDataFirestore() {
    console.log('readData FIRESTORE DATABASE')
    getDocs(collection(db, "users")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`${doc.id} =>`, data)
        });
    });
}

export async function readDataFirestoreByID(id) {
    console.log('readData FIRESTORE DATABASE');

    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Si no se encuentra ningún documento, devolver null o un valor indicativo de que no se encontró nada
        console.log('Documento no encontrado');
        return null; // o puedes devolver un objeto vacío, según tus necesidades
    }

    const firstDoc = querySnapshot.docs[0];
    const data = firstDoc.data();

    console.log(`${firstDoc.id} =>`, data);

    console.log('readData FIRESTORE DATABASE');

    return data;
}
//readDataFirestore()

//UPDATE DATA
function updateDataFirestore(id) {
    console.log('updateData FIRESTORE DATABASE')
    const updateRef = doc(db, 'users', id);
    set(updateRef, { born: 1 }, { last: 'petes' });
}
//updateDataFirestore('zjKrs3Lv24FsbMLuxYqs')

//DELETE DATA
function deleteDataFirestore() {
    console.log('deleteData FIRESTORE DATABASE')

}
//deleteDataFirestore()




// --- REALTIME DATABASE ---
//CREATE DATA
function createDataRealtime(userId, chatId, message) {
    console.log('createData REALTIME DATABASE')
    set(ref(database, 'chats/' + userId), {
        email: chatId,
        message: message,
    });
}
createDataRealtime('1', '2', 'Hello');
function createChatRealtime(_chatId, _userId, _message, _timestamp) {
    console.log('createChat REALTIME DATABASE')
    set(ref(database, 'chats/' + _chatId), {
        user: _userId,
        message: _message,
        timestamp: _timestamp
    });
}
createChatRealtime('1', '2mjhkj', 'Hello', 2345);
createChatRealtime('1', '2mjhkj', 'Hellos', 2345);
createChatRealtime('1', 'jhgkyg', 'bye', 2345);
createChatRealtime('1', '2mjhkj', 'Heluyglo', 2345);

//READ DATA
function readDataRealtime(chatId) {
    console.log('readData REALTIME DATABASE')
    const chatRef = ref(database, 'chats/' + chatId);
    get(chatRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
readDataRealtime('1');

//UPDATE DATA
function updateDataRealtime() {
    console.log('updateData REALTIME DATABASE')

}
updateDataRealtime();

//DELETE DATA
function deleteDataRealtime() {
    console.log('deleteData REALTIME DATABASE')

}
deleteDataRealtime();
*/


