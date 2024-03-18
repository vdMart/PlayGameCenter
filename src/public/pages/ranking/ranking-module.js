import { auth, database, db } from "./../../app/firebase.js";
import { set, get, ref, update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


//Obtener todos los usuarios de Firestore y listarlos por consola
async function getAllUser() {
    const querySnapshot = await getDocs(collection(db, "users"));
    let users = [];

    querySnapshot.forEach((user) => {
        let userInfo = user.data();
        users.push(userInfo);
    });

    // Ordenar usuarios por puntos de mayor a menor
    users.sort((a, b) => b.puntos - a.puntos);

    // Obtener el cuerpo de la tabla
    const rankingBody = document.getElementById('ranking-body');

    // Limpiar el cuerpo de la tabla
    rankingBody.innerHTML = '';

    // Construir filas de la tabla con los usuarios ordenados
    users.forEach((userInfo, index) => {
        const row = document.createElement('tr');
        if(index == 0){
            row.innerHTML = `
            <td class="champions">
                <img class="overlay-image" src="https://images.vexels.com/media/users/3/235463/isolated/lists/93554cd960d533a7dded8b4cd6e175b7-corona-dorada-simple-con-detalles.png" alt="champions">
                <img class="profile-image" src="${userInfo.photo}" alt="Foto de perfil">
            </td>
            <td>${userInfo.nickname}</td>
            <td>${userInfo.puntos}</td>
        `;
        }else {
            row.innerHTML = `
            <td><img src="${userInfo.photo}" alt="Foto de perfil"></td>
            <td>${userInfo.nickname}</td>
            <td>${userInfo.puntos}</td>
        `;
        }
        
        rankingBody.appendChild(row);
    });
}

getAllUser();