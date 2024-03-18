import { auth, db } from "../../app/firebase.js";
import { query, setDoc, addDoc, doc, getDoc, collection, getDocs, where, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

// --- Script notifications module ---

// Obtener listado de usuarios existentes en firestore
async function getUsers() {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    let users = []; // Declarar la variable fuera del bloque if

    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const userInfo = doc.data();
            users.push(userInfo);
        });
    } else {
        console.log('No hay usuarios');
    }
    return users;
}

// Obtener el campo 'pendingUserID' del usuario actual
async function getpendingUserID() {
    const urlParams = new URLSearchParams(window.location.search);
    var idUser = urlParams.get('uid')

    const q = query(collection(db, "users"), where("id", "==", idUser));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];

        let users = [];

        const userInfo = firstDoc.data();
        userInfo.pendingUserID.forEach((user) => {
            users.push(user);
        });

        return users;
    }
}

// Obtener el campo 'friendsUserID' del usuario actual
async function getFriendUserID() {
    const urlParams = new URLSearchParams(window.location.search);
    var idUser = urlParams.get('uid')

    const q = query(collection(db, "users"), where("id", "==", idUser));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];

        let users = [];

        const userInfo = firstDoc.data();
        userInfo.friendsUserID.forEach((user) => {
            users.push(user);
        });

        return users;
    }
}

// Obtener el campo 'pendingUserID' del usuario actual por medio de su id
async function getUserByID(id) {
    const q = query(collection(db, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];

        const userInfo = firstDoc.data();
        return userInfo;
    }

}

async function listarUsers() {
    // Obtener el elemento "pendingInvite" del HTML
    const pendingInvite = document.getElementById('dropdownContent');
    // Obtener los usuarios de Firestore
    const pendingUser = await getpendingUserID();

    // Introducir los usuarios(users) en el elemento "pendingInvite" del HTML en forma de lista
    if (pendingUser.length > 0) {
        // Crear un elemento div para contener la lista
        const resultadoDiv = document.createElement('div');

        let userpending
        // Iterar sobre los usuarios
        for (const userID of pendingUser) {
            userpending = await getUserByID(userID);

            var imagenHTML = '<img src="' + userpending.photo + '" alt="logo profile"></img>';
            var nicknameHTML = `<p><b>${userpending.nickname}</b></p>`;
            let buttonHTML = `<button id="button_${userpending.id}">Aceptar Amistad</button>`;
                
            resultadoDiv.innerHTML += `
            <li>
                ${imagenHTML}
                <div class="nickbtn">
                ${nicknameHTML}
                ${buttonHTML}
                </div>
            </li>`;

        }

        // Establecer el contenido de pendingInvite después de completar el bucle
        pendingInvite.appendChild(resultadoDiv);
        // Agregar un evento al botón recién creado
        const button = document.getElementById(`button_${userpending.id}`);
        button.addEventListener('click', () => {
            addFriend(userpending.id);
        });
    } else {
        pendingInvite.innerHTML = 'No hay usuarios';
    }
}
listarUsers();

async function listarFriends() {
    // Obtener el elemento "listFiends" del HTML
    const listFiends = document.getElementById('listFiends');
    // Obtener los usuarios de Firestore
    const fiendUser = await getFriendUserID();

    // Introducir los usuarios(users) en el elemento "listFiends" del HTML en forma de lista
    if (fiendUser.length > 0) {
        // Crear un elemento div para contener la lista
        const resultadoDiv = document.createElement('div');

        let userFriend
        // Iterar sobre los usuarios
        for (const userID of fiendUser) {
            userFriend = await getUserByID(userID);

            // Agregar cada usuario a resultadoDiv
            var imagenHTML = '<div class="userPhoto"><img src="' + userFriend.photo + '" alt="logo profile"></img></div>';
            var nicknameHTML = `<p><b>${userFriend.nickname}</b></p>`;
            
            resultadoDiv.innerHTML += `
            <li>
                ${imagenHTML}
                ${nicknameHTML}
            </li>`;
        }

        // Establecer el contenido de listFiends después de completar el bucle
        listFiends.appendChild(resultadoDiv);
    } else {
        listFiends.innerHTML = 'No hay usuarios';
    }
}
listarFriends();

//---


//eliminar el usuario de la lista de invitaciones y pendientes y agregarlo a la lista de amigos
async function addFriend(_idUserFriend) {
    const urlParams = new URLSearchParams(window.location.search);
    var idUser = urlParams.get('uid')

    const q = query(collection(db, "users"), where("id", "==", idUser));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];

        const userInfo = firstDoc.data();

        const friendsUserIDArray = userInfo.friendsUserID || [];

        if (!friendsUserIDArray.includes(_idUserFriend)) {
            friendsUserIDArray.push(_idUserFriend);
        }

        // Crear el objeto con el nuevo array
        const dataToUpdate = {
            friendsUserID: friendsUserIDArray,
        };

        let userDocRef = await getRefDocByID(idUser)
        await updateDoc(userDocRef, dataToUpdate); //TODO: obtener userDocRef

        deletePendingUser(_idUserFriend)
        //deleteInviteUser(_idUserFriend)

    }
}

async function deletePendingUser(_idUserFriend) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        var idUser = urlParams.get('uid')

        const q = query(collection(db, "users"), where("id", "==", idUser));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const firstDoc = querySnapshot.docs[0];

            const userInfo = firstDoc.data();
            const pendingUserIDArray = userInfo.pendingUserID || [];

            const updatedPendingArray = pendingUserIDArray.filter(id => id !== _idUserFriend);

            const dataToUpdate = {
                pendingUserID: updatedPendingArray,
            };

            let userDocRef = await getRefDocByID(idUser)
            await updateDoc(userDocRef, dataToUpdate);
            console.log('Usuario eliminado de la lista de amigos correctamente.');
        } else {
            console.log('No se encontró el documento del usuario actual.');
        }
    } catch (error) {
        console.error('Error al eliminar el usuario de la lista de amigos:', error);
    }
}
//---



async function getRefDocByID(_userID) {
    try {
        const usersCollectionRef = collection(db, "users");
        console.log('Id Usuario a buscar: ', _userID);
        const q = query(usersCollectionRef, where('id', '==', _userID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0];
            return userData.ref; // Devolver la referencia al documento
        } else {
            console.log('No se encontró ningún documento con el ID proporcionado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar la referencia del documento:', error);
        return null;
    }
}









async function showPhoto(uid) {
    var rutaImagen = await getPhoto(uid);
  console.log('Ruta de la imagen: ' + rutaImagen)
  var imagenHTML = '<img src="' + rutaImagen + '" alt="logo profile"></img>';
  var contenedorLogo = document.getElementById("profilePhoto");

  contenedorLogo.innerHTML = imagenHTML + contenedorLogo.innerHTML;
}
showPhoto()

async function getPhoto(uid) {
    const q = query(collection(db, "users"), where("id", "==", uid));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
  
      const userInfo = firstDoc.data();
  
      const photo = userInfo.photo;
      console.log('Photo: ' + photo)
      if (photo == null) {
        return puntosBack + 'resource/profile.webp';
      }
      return photo;
    }
    console.log('No user signed in');
    return 'null';
}