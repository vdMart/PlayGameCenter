
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "../../app/firebase.js";

// --- Scripts profile Module ---

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');


onAuthStateChanged(auth, async (user) => {
    console.log('Hola perfil', user);

    if (user) {
        await handleLoggedInUser();
    } else {
        handleLoggedOutUser();
    }

});

async function handleLoggedInUser() {
    document.getElementById('nicknameProfile').innerHTML = await getNickname();
    document.getElementById('emailProfile').innerHTML = getEmail();
}

function handleLoggedOutUser() {
    document.getElementById('nicknameProfile').innerHTML = 'Invitado';
    document.getElementById('emailProfile').innerHTML = '';
}

function getEmail() {
    const user = auth.currentUser;
    if (user) {
        const email = user.email;
        if (email == null) {
            return 'Desconocido';
        }
        return email;
    }
    console.log('No user signed in');
    return 'null';
}

async function getNickname() {
    const q = query(collection(db, "users"), where("id", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('Documento no encontrado');
    }

    const firstDoc = querySnapshot.docs[0];
    const data = firstDoc.data();

    return data.nickname;
}






async function showPhoto() {
    var rutaImagen = await getPhoto();
  console.log('Ruta de la imagen: ' + rutaImagen)
  var imagenHTML = '<img class="imagen-perfil" src="' + rutaImagen + '" alt="logo profile"></img>';
  var contenedorLogo = document.getElementById("profilePhoto");

  contenedorLogo.innerHTML = imagenHTML + contenedorLogo.innerHTML;
}
showPhoto()

async function getPhoto() {
    //get id from url
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const user = auth.currentUser;
  
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