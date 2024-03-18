
/* --- Scripts Notifications --- */

//Obtener el elemento con el id "inbox" y agregarle la clase "selected"
function addSelected() {
    const notifications = document.getElementById("inbox");
    notifications.classList.add("selected");
}
addSelected();


function adddropdown() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');

    dropdownButton.addEventListener('click', function () {
        dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
    });

    // Cerrar el desplegable si se hace clic fuera de él
    window.addEventListener('click', function (event) {
        if (!event.target.matches('#dropdownButton')) {
            dropdownContent.style.display = 'none';
        }
    });
}

adddropdown()