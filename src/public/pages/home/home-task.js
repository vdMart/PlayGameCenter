
/* --- Scripts Home --- */

//Obtener el elemento con el id "home" y agregarle la clase "selected"
function addSelected() {
  const home = document.getElementById("home");
  home.classList.add("selected");
}
addSelected();

document.getElementById('tictactoe').addEventListener('click', function() {
  window.location.href = './../game/tictactoe/tictactoe.html';
});

document.getElementById('dotsnboxes').addEventListener('click', function() {
  window.location.href = './../game/dotsnboxes/dotsnboxes.html';
});

document.getElementById('chess').addEventListener('click', function() {
  window.location.href = './../game/chess/chess.html';
});

document.getElementById('snake').addEventListener('click', function() {
  window.location.href = './../game/snake/snake.html';
});

document.getElementById('connect4').addEventListener('click', function() {
  window.location.href = './../game/connect4/connect4.html';
});

document.getElementById('reversi').addEventListener('click', function() {
  window.location.href = './../game/reversi/reversi.html';
});

document.getElementById('tetris').addEventListener('click', function() {
  window.location.href = './../game/tetris/tetris.html';
});