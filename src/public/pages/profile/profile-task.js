
/* --- Scripts Profile --- */


const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const profileDetails = document.getElementById('profileDetails');
const editForm = document.getElementById('editForm');

editButton.addEventListener('click', function () {
    console.log('click');
    editButton.style.display = 'none';
    profileDetails.style.display = 'none';
    editForm.style.display = 'block';
});

cancelButton.addEventListener('click', function () {
    editButton.style.display = 'flex';
    profileDetails.style.display = 'block';
    editForm.style.display = 'none';
});

saveButton.addEventListener('click', function () {
    editButton.style.display = 'flex';
    profileDetails.style.display = 'block';
    editForm.style.display = 'none';
});



