import { auth, db } from "../../app/firebase.js";
import { query, setDoc, addDoc, doc, getDoc, collection, getDocs, where, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

// --- Scripts social Module ---

document.getElementById('buscar').addEventListener('click', async () => {
    const nombreBuscado = document.getElementById('nombre').value.trim();

    const q = query(collection(db, "users"), where('nickname', '>=', nombreBuscado), where('nickname', '<=', nombreBuscado + '\uf8ff'));
    const querySnapshot = await getDocs(q);

    mostrarResultados(querySnapshot);
});

async function mostrarResultados(snapshot) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    if (snapshot.empty) {
        resultadosDiv.innerHTML = 'No se encontraron amigos.';
        return;
    }

    snapshot.forEach(async doc => {
        console.log(doc.id, '=>', doc.data());
        const userInfo = doc.data();
        const nickname = userInfo.nickname;
        const email = userInfo.email;
        const photo = userInfo.photo;
        const refDoc = doc.id;

        // Filtro 1: No listar si el ID es el mismo que el del usuario actual
        if (userInfo.id === auth.currentUser.uid) {
            return;
        }

        let buttonHTML = `<button id="button_${refDoc}">Solicitar Amistad</button>`;

        // Obtener los datos del usuario actual de forma asíncrona
        const currentUserData = await getRefDocByID2(auth.currentUser.uid);

        // Filtro 2: Botón "Amistad Pendiente" si el ID está en inviteUserID
        if (currentUserData.inviteUserID != undefined) {
            if (currentUserData && currentUserData.inviteUserID && currentUserData.inviteUserID.includes(userInfo.id)) {
                buttonHTML = `<button id="button_${refDoc}">Amistad Pendiente</button>`;
            }
        }
        
        // Filtro 3: Botón "Aceptar Amistad" si el ID está en pendingUserID
        if (currentUserData && currentUserData.pendingUserID && currentUserData.pendingUserID.includes(userInfo.id)) {
            buttonHTML = `<button id="button_${refDoc}">Aceptar Amistad</button>`;
        }

        // Filtro 4: Botón "Cancelar Amistad" si el ID está en friendsUserID
        if (currentUserData && currentUserData.friendsUserID && currentUserData.friendsUserID.includes(userInfo.id)) {
            buttonHTML = `<button id="button_${refDoc}">Cancelar Amistad</button>`;
        }

        const resultadoDiv = document.createElement('div');
        resultadoDiv.classList.add('divUser');

        resultadoDiv.innerHTML = `
            <div class="divImg">
                <img src=${photo} alt="">
                <div class="dataUser">
                    <p><b>${nickname}</b></p>
                    <p>${email}</p>
                </div>
            </div>
            ${buttonHTML}
        `;

        resultadosDiv.appendChild(resultadoDiv);

        // Agregar un evento al botón recién creado
        const button = document.getElementById(`button_${refDoc}`);
        button.addEventListener('click', () => {
            mostrarId(userInfo.id);
        });
    });
}


//Obtener el campo "id" del documento con la referencia proporcionada en "_userRefDoc"
async function geIDtByRefDoc(_userRefDoc) {
    try {
        const userDocRef = doc(db, "users", _userRefDoc);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Datos del documento:', userData);
            return userData.id;
        } else {
            console.log('El documento no existe');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el documento:', error);
        return null;
    }
}

window.mostrarId = function(inviteUserID) {
    getRefDocByID(auth.currentUser.uid).then(async currentUserDocRef => {
        updateInviteFirestore(currentUserDocRef, inviteUserID);
        updatePendingFirestore(await getRefDocByID(inviteUserID), await geIDtByRefDoc(currentUserDocRef));
    });
};

async function getRefDocByID2(_userID) {
    try {
        const usersCollectionRef = collection(db, "users");
        console.log('Id Usuario a buscar: ', _userID);
        const q = query(usersCollectionRef, where('id', '==', _userID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data(); // Obtener los datos del documento
            console.log('Datos del documento:', userData);
            return userData;
        } else {
            console.log('No se encontró ningún documento con el ID proporcionado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar la referencia del documento:', error);
        return null;
    }
}

async function getRefDocByID(_userID) {
    try {
        const usersCollectionRef = collection(db, "users");
        console.log('Id Usuario a buscar: ', _userID);
        const q = query(usersCollectionRef, where('id', '==', _userID));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            console.log('Referencia del documento:', userDocRef.id);
            return userDocRef.id; // Devolver solo el ID del documento
        } else {
            console.log('No se encontró ningún documento con el ID proporcionado');
            return null;
        }
    } catch (error) {
        console.error('Error al buscar la referencia del documento:', error);
        return null;
    }
}

async function updateInviteFirestore(_currentUserDocID, _inviteUserID) {
    console.log('updateData FIRESTORE DATABASE');
    try {
        const userDocRef = doc(db, "users", _currentUserDocID);

        const userDoc = await getDoc(userDocRef, { source: "server" });
        console.log('userDoc:', userDoc);

        if (userDoc.exists()) {
            // Obtener los datos actuales del documento
            const currentData = userDoc.data();

            // Verificar si ya hay un array de inviteUserID, si no, crear uno vacío
            const inviteUserIDArray = currentData.inviteUserID || [];

            // Agregar el nuevo inviteUserID al array
            if (!inviteUserIDArray.includes(_inviteUserID)) {
                inviteUserIDArray.push(_inviteUserID);
            }

            // Crear el objeto con el nuevo array
            const dataToUpdate = {
                inviteUserID: inviteUserIDArray,
            };

            // Utilizar updateDoc para actualizar solo el campo especificado
            await updateDoc(userDocRef, dataToUpdate);
            var ref = await getRefDocByID(_inviteUserID)
            const button = document.getElementById(`button_${ref}`); //TODO: Si la referencia es del mismo usuario da error porque no existe el botón
            if(button){
                button.textContent = 'Amistad Pendiente';
                console.log('Documento actualizado correctamente en Firestore');
            }
        } else {
            console.error('El documento no existe en Firestore');
        }
    } catch (error) {
        console.error('Error al actualizar documento en Firestore:', error);
    }
}

async function updatePendingFirestore(_currentUserDocID, _inviteUserID) {
    console.log('updateData FIRESTORE DATABASE');
    try {
        const userDocRef = doc(db, "users", _currentUserDocID);

        const userDoc = await getDoc(userDocRef, { source: "server" });
        console.log('userDoc:', userDoc);

        if (userDoc.exists()) {
            // Obtener los datos actuales del documento
            const currentData = userDoc.data();

            // Verificar si ya hay un array de inviteUserID, si no, crear uno vacío
            const inviteUserIDArray = currentData.inviteUserID || [];

            // Agregar el nuevo inviteUserID al array
            if (!inviteUserIDArray.includes(_inviteUserID)) {
                inviteUserIDArray.push(_inviteUserID);
            }

            // Crear el objeto con el nuevo array
            const dataToUpdate = {
                pendingUserID: inviteUserIDArray,
            };

            // Utilizar updateDoc para actualizar solo el campo especificado
            await updateDoc(userDocRef, dataToUpdate);
            var ref = await getRefDocByID(_inviteUserID)
            const button = document.getElementById(`button_${ref}`); //TODO: Si la referencia es del mismo usuario da error porque no existe el botón
            if(button){
                button.textContent = 'Amistad Pendiente';
                console.log('Documento actualizado correctamente en Firestore');
            }
        } else {
            console.error('El documento no existe en Firestore');
        }
    } catch (error) {
        console.error('Error al actualizar documento en Firestore:', error);
    }
}
