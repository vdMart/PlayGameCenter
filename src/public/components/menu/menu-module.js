import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { auth, db } from "../../app/firebase.js";
import { loginCheck } from "../../app/loginCheck.js";



var urlActual = window.location.href
var partesUrl = urlActual.split('/');
var posicionPublic = partesUrl.indexOf('public');
var posicionesHaciaAtras = partesUrl.length - 2 - posicionPublic;
var puntosBack = '../'.repeat(posicionesHaciaAtras);
var puntosBack2 = '../'.repeat(posicionesHaciaAtras) + 'pages/';


// --- Navigation ---
document.getElementById('usuario').addEventListener('click', () => {
  var uId = auth.currentUser.uid
  var urlDestino = puntosBack2 + 'profile/profile.html' + '?uid=' + uId;
  window.location.href = urlDestino;
});

document.getElementById('home').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'home/home.html';
  window.location.href = urlDestino;
});

document.getElementById('inbox').addEventListener('click', () => {
  var uId = auth.currentUser.uid
  var idGame = "1"; //TODO Generate to invite to a game
  var urlDestino = puntosBack2 + 'notifications/notifications.html' + '?uid=' + uId + '&idGame=' + idGame;
  window.location.href = urlDestino;
});

document.getElementById('favorite').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'favorite/favorite.html';
  window.location.href = urlDestino;
});

document.getElementById('ranking').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'ranking/ranking.html';
  window.location.href = urlDestino;
});

document.getElementById('social').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'social/social.html';
  window.location.href = urlDestino;
});

document.getElementById('roomGame').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'room/room.html';
  window.location.href = urlDestino;
});

document.getElementById('gitGame').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'gitGame/gitGame.html';
  window.location.href = urlDestino;
});

document.getElementById('apoyanos').addEventListener('click', () => {
  var urlDestino = puntosBack2 + 'apoyanos/apoyanos.html';
  window.location.href = urlDestino;
});
// --- Navigation ---




// --- Actions ---
// Theme mode switch
const palanca = document.querySelector(".switch");

palanca.addEventListener("click", () => {
  let body = document.body;
  body.classList.toggle("dark-mode");
  //body.classList.toggle("");
  circulo.classList.toggle("prendido");
});



// list for auth state changes
onAuthStateChanged(auth, async (user) => {
  console.log('User state change. Current user:', user);

  loginCheck(user);

  if (user) {
    await handleLoggedInUser();
  } else {
    handleLoggedOutUser();
  }
  await setNotification();

});

async function handleLoggedInUser() {
  document.getElementById('nickname').innerHTML = await getNickname();
  document.getElementById('email').innerHTML = getEmail();

  var rutaImagen = await getPhoto();
  console.log('Ruta de la imagen: ' + rutaImagen)
  var imagenHTML = '<img src="' + rutaImagen + '" alt="logo profile"></img>';
  var contenedorLogo = document.getElementById("usuario");

  contenedorLogo.innerHTML = imagenHTML + contenedorLogo.innerHTML;
}

function handleLoggedOutUser() {
  document.getElementById('nickname').innerHTML = 'Invitado';
  document.getElementById('email').innerHTML = '';
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

async function getPhoto() {
  const user = auth.currentUser;

  const q = query(collection(db, "users"), where("id", "==", user.uid));
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





// --- Actions ---
// Notificaciones:
async function setNotification() {

  var inboxLink = document.getElementById('inbox');
  var oldIonIcon = document.getElementById('mailIcon');

  if (auth != null, auth.currentUser != null) {
    if (await haveNotification(auth.currentUser.uid)) {
      var svgExternalPath = puntosBack + 'resource/msg-unread.svg';
    } else {
      var svgExternalPath = puntosBack + 'resource/msg-read.svg';
    }
  } else {
    var svgExternalPath = puntosBack + 'resource/msg-read.svg';
  }

  fetch(svgExternalPath)
    .then(response => response.text())
    .then(svgContent => {
      // Crea un nuevo elemento div y asigna el contenido del SVG
      var div = document.createElement('div');
      div.innerHTML = svgContent;

      // Obtiene el primer hijo del div (el SVG)
      var newSvg = div.firstChild;

      // Clona los estilos del antiguo IonIcon al nuevo SVG
      newSvg.setAttribute('style', window.getComputedStyle(oldIonIcon).cssText);
      newSvg.setAttribute('width', '20');
      newSvg.setAttribute('height', '20');
      newSvg.style.marginRight = '15px';
      newSvg.style.marginLeft = '15px';

      // Reemplaza el antiguo IonIcon con el nuevo SVG
      inboxLink.replaceChild(newSvg, oldIonIcon);
    })
    .catch(error => console.error('Error al obtener el SVG externo:', error));
}

async function haveNotification(id) {
  console.log('readData FIRESTORE DATABASE');

  const q = query(collection(db, "users"), where("id", "==", id));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log('Documento no encontrado');
  }

  const firstDoc = querySnapshot.docs[0];
  const data = firstDoc.data();

  if (data && data.pendingUserID !== undefined) {
    if (data.pendingUserID.length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    console.log('El campo "pendingUserID" no existe en el documento.');
    return false;
  }
}











