import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js";

const logout = document.querySelector("#logout");

logout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth)
    const usuario = document.getElementById('usuario');
    const imagenes = usuario.getElementsByTagName('img');
    for (let i = 0; i < imagenes.length; i++) {
      const img = imagenes[i];
      img.parentNode.removeChild(img); // Eliminar la imagen
    }
    console.log("signup out");
  } catch (error) {
    console.log(error)
  }
});